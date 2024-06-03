<script lang="ts">
	import { PUBLIC_FRAME_BASE_URL } from '$env/static/public';
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import { getFlow, insertFlow } from '$lib/services/flowService';
	import { errorPipe, getPreviewUrl } from '$lib/services/utils';
	import { user, farcaster, setFarcaster } from '$lib/services/store';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import Tips from './Tips.svelte';

	export let farcasterId = 0;
	export let title = 'Create';
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
	let loading = false;

	onMount(async () => {
		setFarcaster({ id: farcasterId });
		if (farcasterId > 0) {
			const flow = await getFlow(farcasterId);
			if (flow) {
				name = flow.name;
				nft = flow.input?.nft;
				price = flow.input?.price;
				cover = flow.cover;
			} else {
				toast.error('Wrong id');
			}
		} else {
			name = ''; //'test';
			nft = ''; //'0x2F6F12b68165aBb483484927919D0d3fE450462E';
			cover = ''; //'https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png';
			price = 0; //0.005;
		}
		previewHandler();
	});

	const previewHandler = async () => {
		if (!name || !nft) {
			return;
		}
		loading = true;

		frameUrl = '';
		prviewImage = await getPreviewUrl(PUBLIC_FRAME_BASE_URL, name, cover, price, nft);
		loading = false;
	};

	const saveHandler = async () => {
		try {
			if (!name || !nft) {
				toast.error('Please input name or nft');
				return;
			}
			await insertFlow({
				name: name,
				cover: cover,
				input: { price: price.toString(), nft: nft },
				creator: $user.fid,
				id: $farcaster.id
			});
			toast.success('Save success!');

			//frameUrl = `${PUBLIC_FRAME_BASE_URL}/api/${$farcaster.id}`;
		} catch (e: any) {
			//alert(e);
			console.log(e.response);
			toast.error(errorPipe(e.response?.data?.message));
		}
	};

	const publishHandler = async () => {
		if ($farcaster.id) {
			frameUrl = `${PUBLIC_FRAME_BASE_URL}/api/${$farcaster.id}?v=${new Date().getTime()}`;
			// const result = await publishFlow({
			// 	fid: $user.fid.toString(),
			// 	signerUuid: $user.signerUuid,
			// 	frameUrl,
			// 	content: name,
			// 	flowId: $farcaster.id
			// });
		} else {
			toast.error('Please save first');
		}
	};
</script>

<div class="bg-gray-800 py-6 px-6 rounded-3xl h-full">
	<div class="text-white font-bold text-2xl mb-4">{title} Flow</div>
	<section class="w-full grid grid-cols-2 gap-8">
		<div class="w-full bg-gray-100 rounded-3xl h-[500px]">
			<div class="py-4 px-6 mb-4 font-bold border-b border-gray-300 text-xl">Design</div>
			<div class="px-6">
				<div class="flex items-center mb-2">
					<div class="w-[50px] font-bold">Name:</div>
					<input
						class="border px-4 py-2 ml-4"
						bind:value={name}
						on:keyup={() => previewHandler()}
					/>
				</div>
				<div class="flex items-center mb-2">
					<div class="w-[50px] font-bold">ERC20:</div>
					<input
						class="border px-4 py-2 ml-4 w-full"
						bind:value={nft}
						on:keyup={() => previewHandler()}
					/>
				</div>
				<div class="flex items-center mb-2">
					<div class="w-[50px] font-bold">Price:</div>
					<div class="flex items-center">
						<input
							class="border px-4 py-2 ml-4 w-[100px]"
							bind:value={price}
							type="number"
							on:keyup={() => previewHandler()}
						/>
						<div class="bg-gray-300 px-4 py-2 font-bold">ETH</div>
					</div>
				</div>
				<div class="flex items-center mb-2">
					<div class="w-[50px] font-bold">Cover:</div>
					<textarea
						class="border px-4 py-2 ml-4 w-full"
						bind:value={cover}
						rows="5"
						on:keyup={() => previewHandler()}
					></textarea>
				</div>
			</div>
		</div>
		<div class="w-full bg-gray-100 rounded-3xl h-[500px]">
			<div class="py-4 px-6 mb-4 font-bold border-b border-gray-300 text-xl">Preview</div>
			<div class="px-6">
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
		</div>
	</section>
	<div class="flex mt-8 justify-center text-white">
		<button class="border rounded-lg mx-8 px-4 py-2 bg-gray-100 text-black" on:click={cancelHandler}
			>Reset</button
		>

		<button class="rounded-lg mx-8 px-4 py-2 bg-violet-400 text-white" on:click={saveHandler}
			>Save</button
		>
		<button class="rounded-lg mx-8 px-4 py-2 bg-blue-600 text-white" on:click={publishHandler}
			>Publish
		</button>
		<!-- {$farcaster.id} -->
	</div>

	{#if frameUrl}
		<Tips {frameUrl} />
	{/if}
</div>
<div id="clipboard"></div>
<Toaster />

<style>
	section {
		display: flex;
		/* flex-direction: column; */
		justify-content: center;
		align-items: center;
		/* flex: 0.6; */
	}
	textarea {
		resize: none;
	}
	textarea:focus,
	input:focus {
		outline: none;
	}
</style>
