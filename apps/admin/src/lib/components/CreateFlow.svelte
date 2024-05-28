<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_FRAME_BASE_URL } from '$env/static/public';
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import { getFlowById, insertFlow, publishFlow } from '$lib/services/flowService';
	import { errorPipe, signed } from '$lib/services/utils';
	import { user, farcaster, setFarcaster } from '$lib/services/store';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import CopyClipBoard from '$lib/components/CopyClipBoard.svelte';

	export let farcasterId = 0;
	let frameUrl = '';
	let name: string = '';
	let nft: string = '';
	let cover: string = '';
	let price: number = 0;
	const cancelHandler = () => {
		name = '';
		nft = '';
		cover = '';
		price = 0;
		prviewImage = '';
	};
	let prviewImage = '';
	let previewUrl = '';
	let loading = false;
	let error = '';

	onMount(async () => {
		setFarcaster({ id: farcasterId });
		console.log(farcasterId, farcasterId > 0);
		if (farcasterId > 0) {
			const flow = await getFlowById(farcasterId);
			if (flow.length > 0) {
				name = flow[0].name;
				nft = flow[0].input.nft;
				price = flow[0].input.price;
				cover = flow[0].cover;
			} else {
				error = 'Wrong id';
			}
		} else {
			name = 'test';
			nft = '0x1B633271826B30E86851adf5aa50871CDF9036C6';
			cover =
				'https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png';
			price = 0.005;
		}
	});

	const previewHandler = async () => {
		if (!name || !nft) {
			error = 'Please input name or nft';
			return;
		}
		loading = true;

		frameUrl = '';
		previewUrl = `${PUBLIC_FRAME_BASE_URL}/api/0?name=${name}&price=${price}&nft=${nft}`;
		if (cover) {
			previewUrl += `&image=${cover}`;
		}
		const res = await axios.get(previewUrl);

		const parser = new DOMParser();
		const document = parser.parseFromString(res.data, 'text/html');

		prviewImage = document?.querySelector('meta[property="fc:frame:image"]').content;
		loading = false;
	};

	const saveHandler = async () => {
		resetError();
		try {
			if (!name || !nft) {
				error = 'Please input name or nft';
				return;
			}
			await insertFlow({
				name: name,
				cover: cover,
				input: { price: price.toString(), nft: nft },
				creator: $user.fid,
				id: $farcaster.id
			});
			error = 'Save success!';
			//frameUrl = `${PUBLIC_FRAME_BASE_URL}/api/${$farcaster.id}`;
		} catch (e) {
			//alert(e);
			console.log(e.response.data.message);
			error = errorPipe(e.response.data.message);
		}
	};

	const publishHandler = async () => {
		resetError();
		if ($farcaster.id) {
			frameUrl = `${PUBLIC_FRAME_BASE_URL}/api/${$farcaster.id}`;
			const result = await publishFlow({
				fid: $user.fid.toString(),
				signerUuid: $user.signerUuid,
				frameUrl,
				content: 'test'
			});
			console.log('result', result);
		} else {
			error = 'Please save it';
		}
	};

	const copy = () => {
		const app = new CopyClipBoard({
			target: document.getElementById('clipboard'),
			props: { name }
		});
		app.$destroy();
	};

	const resetError = () => {
		error = '';
	};
</script>

<section class="w-full grid grid-cols-2 gap-8">
	<div class="w-full lg:w-2/5 bg-gray-300 py-6 px-6 rounded-3xl h-[500px]">
		<div class="flex items-center mb-2">
			<div class="w-[50px]">Name:</div>
			<input class="border px-4 py-2 ml-4" bind:value={name} />
		</div>
		<div class="flex items-center mb-2">
			<div class="w-[50px]">NFT:</div>
			<input class="border px-4 py-2 ml-4" bind:value={nft} />
		</div>
		<div class="flex items-center mb-2">
			<div class="w-[50px]">Price:</div>
			<input class="border px-4 py-2 ml-4" bind:value={price} type="number" />
		</div>
		<div class="flex items-center mb-2">
			<div class="w-[50px]">Image:</div>
			<input class="border px-4 py-2 ml-4 w-full" bind:value={cover} />
		</div>
	</div>
	<div class="w-full lg:w-2/5 bg-gray-300 py-6 px-6 rounded-3xl h-[500px]">
		<div class="mb-4">Preview</div>
		{#if loading}
			Loading ...
		{:else if prviewImage}
			<div class="relative rounded-md relative w-full">
				<div class="relative">
					<img
						class="bg-background-200 border border-slate-200 min-h-img object-cover rounded-t-lg text-background-200 w-full"
						src={prviewImage}
						alt="Preview Frame"
						style="aspect-ratio: 1.91 / 1; max-height: 532.5px;"
					/>
				</div>
				<FrameButtons />
			</div>
		{/if}
	</div>
</section>
<div class="flex mt-4 justify-center text-white">
	<button class="border rounded-lg mx-8 px-4 py-2 bg-gray-100 text-black" on:click={cancelHandler}
		>Cancel</button
	>
	<button class="rounded-lg mx-8 px-4 py-2 bg-blue-400 text-white" on:click={previewHandler}
		>Preview</button
	>
	<button class="rounded-lg mx-8 px-4 py-2 bg-violet-400 text-white" on:click={saveHandler}
		>Save</button
	>
	<button class="rounded-lg mx-8 px-4 py-2 bg-blue-600 text-white" on:click={publishHandler}
		>Publish
	</button>
	<!-- {$farcaster.id} -->
</div>
{#if error}
	<div class="w-1/2 mx-auto text-white mt-4">
		{error}
	</div>
{/if}

{#if frameUrl}
	<div class="flex mt-4 justify-center text-white w-1/2 mx-auto">
		Please copy this url (<a href={frameUrl} class="break-all">{frameUrl}</a>) to your cast.
	</div>
{/if}

<style>
	section {
		display: flex;
		/* flex-direction: column; */
		justify-content: center;
		align-items: center;
		/* flex: 0.6; */
	}
</style>
