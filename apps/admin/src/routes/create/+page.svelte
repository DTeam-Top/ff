<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_BASE_URL, PUBLIC_FRAME_BASE_URL } from '$env/static/public';
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import { signed } from '$lib/services/utils';
	import axios from 'axios';
	let frameUrl = '';

	let name: string = 'test';
	let nft: string = '0x1B633271826B30E86851adf5aa50871CDF9036C6';
	let image: string =
		'https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png';
	let price: number = 0.005;
	const cancelHandler = () => {
		name = '';
		nft = '';
		image = '';
		price = 0;
		prviewImage = '';
	};
	let prviewImage = '';
	let previewUrl = `${PUBLIC_FRAME_BASE_URL}/api/0?name=${name}&price=${price}&nft=${nft}`;
	const previewHandler = async () => {
		frameUrl = '';
		if (image) {
			previewUrl += `&image=${image}`;
		}
		const res = await axios.get(previewUrl);

		const parser = new DOMParser();
		const document = parser.parseFromString(res.data, 'text/html');
		prviewImage = document?.querySelector('meta[property="fc:frame:image"]').content;
	};
	const saveHandler = () => {};
	const publishHandler = () => {
		frameUrl = previewUrl;
	};
	$: if (!$signed) {
		goto('/');
	}
</script>

<svelte:head>
	<title>Create</title>
	<meta name="description" content="Create frame" />
</svelte:head>

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
			<input class="border px-4 py-2 ml-4 w-full" bind:value={image} />
		</div>
	</div>
	<div class="w-full lg:w-2/5 bg-gray-300 py-6 px-6 rounded-3xl h-[500px]">
		<div class="mb-4">Preview</div>
		{#if prviewImage}
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
		>Publish</button
	>
</div>
{#if frameUrl}
	<div class="flex mt-4 justify-center text-white w-1/2 mx-auto">
		<a href={frameUrl} class="break-all">{frameUrl}</a>
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
