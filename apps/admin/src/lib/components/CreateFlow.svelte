<script lang="ts">
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import { getFlow, insertFlow, publishFlow } from '$lib/client/flowService';
	import { errorPipe, getPreviewUrl } from '$lib/client/utils';
	import { user, farcaster, setFarcaster } from '$lib/client/store';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import Tips from './Tips.svelte';
	import { FRAME_BASE_URL, STATUS_PUBLISHED } from '$lib/client/clientConsts';

	export let farcasterId = 'uuid';
	export let title = 'Create';
	let frameUrl = '';
	let name: string = '';
	let address: string = '';
	let cover: string = '';
	let price: number = 0;
	let isPublished = false;
	const cancelHandler = () => {
		name = '';
		address = '';
		cover = '';
		price = 0;
		prviewImage = '';
	};
	let prviewImage = '';
	let loading = false;

	onMount(async () => {
		setFarcaster({ id: farcasterId });
		console.log(farcasterId, farcasterId !== 'uuid');
		if (farcasterId.toString() !== 'uuid') {
			const flow = await getFlow(farcasterId);
			console.log(flow);
			if (flow) {
				name = flow.name;
				address = flow.input?.address;
				price = flow.input?.price;
				cover = flow.cover;
				isPublished = flow.status === STATUS_PUBLISHED;
				if (isPublished) {
					frameUrl = `${FRAME_BASE_URL}/api/${$farcaster.id}`;
				}
			} else {
				toast.error('Wrong id');
			}
		} else {
			name = 'test'; //'test';
			address = '0x2F6F12b68165aBb483484927919D0d3fE450462E'; //'0x2F6F12b68165aBb483484927919D0d3fE450462E';
			cover =
				'https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png'; //'https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png';
			price = 0.005; //0.005;
		}
		previewHandler();
	});

	const previewHandler = async () => {
		if (!name || !address) {
			return;
		}
		loading = true;

		//frameUrl = '';
		prviewImage = await getPreviewUrl(FRAME_BASE_URL, name, cover, price, address);
		loading = false;
	};

	const saveHandler = async () => {
		try {
			if (!name || !address || !cover) {
				toast.error('Please input name , ERC20 , cover');
				return;
			}

			await insertFlow({
				name: name,
				cover: cover,
				input: { price: price.toString(), address: address },
				creator: $user.fid,
				id: $farcaster.id
			});
			toast.success('Save success!');
		} catch (e: any) {
			//alert(e);
			console.log(e.response);
			toast.error(errorPipe(e.response?.data?.message));
		}
	};

	const publishHandler = async () => {
		if ($farcaster.id) {
			const result = await publishFlow($farcaster.id);
			frameUrl = `${FRAME_BASE_URL}/api/${$farcaster.id}`;
			isPublished = true;
		} else {
			toast.error('Please save first');
		}
	};
</script>

<div class="bg-gray-800 py-6 px-6 rounded-3xl">
	<div class="text-white font-bold text-2xl mb-4">{title} Flow</div>
	<section class="w-full max-w-[2000px] mx-auto table border-spacing-x-8">
		<div class="w-2/5 bg-gray-100 rounded-3xl table-cell p-8">
			<div class="py-4 px-6 mb-4 font-bold border-b border-gray-300 text-xl">Design</div>
			<div class="px-6">
				<div class="flex items-center mb-2">
					<div class="w-[50px] font-bold">Name:</div>
					<input
						class="border px-4 py-2 ml-4"
						placeholder="Flow name"
						bind:value={name}
						on:keyup={() => previewHandler()}
					/>
				</div>
				<div class="flex items-center mb-2">
					<div class="w-[50px] font-bold">ERC20:</div>
					<input
						class="border px-4 py-2 ml-4 w-full"
						bind:value={address}
						placeholder="ERC20 address"
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
						placeholder="Image's url"
						rows="5"
						on:keyup={() => previewHandler()}
					></textarea>
				</div>
			</div>
		</div>
		<div class="w-2/5 bg-gray-100 rounded-3xl table-cell">
			<div class="py-4 px-6 mb-4 font-bold border-b border-gray-300 text-xl">Preview</div>
			<div class="px-6">
				{#if loading}
					Loading ...
				{:else if prviewImage}
					<div class="relative rounded-md relative w-full mb-4">
						<div class="relative">
							<img
								class="bg-background-200 border border-slate-200 max-h-[532px] object-cover rounded-t-lg text-background-200 w-full"
								src={prviewImage}
								alt="Preview Frame"
							/>
						</div>
						<FrameButtons />
					</div>
				{/if}
			</div>
		</div>
	</section>
	{#if !isPublished}
		<div class="flex mt-8 justify-center text-white">
			<button
				class="border rounded-lg mx-8 px-4 py-2 bg-gray-100 text-black"
				on:click={cancelHandler}>Reset</button
			>

			<button class="rounded-lg mx-8 px-4 py-2 bg-violet-400 text-white" on:click={saveHandler}
				>Save</button
			>
			<button class="rounded-lg mx-8 px-4 py-2 bg-blue-600 text-white" on:click={publishHandler}
				>Publish
			</button>
			<!-- {$farcaster.id} -->
		</div>
	{/if}

	{#if frameUrl || (frameUrl && isPublished)}
		<Tips {frameUrl} />
	{/if}
</div>
<div id="clipboard"></div>
<Toaster />

<style>
	section {
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
