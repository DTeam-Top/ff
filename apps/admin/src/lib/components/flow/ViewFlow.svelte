<script lang="ts">
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import { getFlow } from '$lib/client/flowService';
	import { addressPipe, getPreviewUrl } from '$lib/client/utils';
	import { farcaster, setFarcaster } from '$lib/client/store';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { FRAME_BASE_URL, STATUS_PUBLISHED } from '$lib/client/clientConsts';
	import Tips from '../Tips.svelte';

	export let farcasterId = 'uuid';
	export let title = 'Create';
	let frameUrl = '';
	let name: string = '';
	let address: string = '';
	let cover: string = '';
	let price: number = 0;
	let isPublished = false;
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
		}
		previewHandler();
	});

	const previewHandler = async () => {
		if (!name || !address) {
			return;
		}
		loading = true;
		prviewImage = await getPreviewUrl(FRAME_BASE_URL, name, cover, price, address);
		loading = false;
	};
</script>

<div class="p-6 m-4 text-black">
	<ol class="breadcrumb mb-8">
		<li class="crumb"><a class="anchor" href="/flows">Flow list</a></li>
		<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
		<li class="text-white">{title} Flow</li>
	</ol>
	<section class="w-full max-w-[2000px] mx-auto border-spacing-x-8 table bg-transparent">
		<div class="lg:w-2/5 md:w-2/5 card lg:table-cell md:table-cell text-white">
			<div class="py-4 px-6 mb-4 font-bold border-b border-surface-500/30 text-xl">Design</div>
			<div class="px-6">
				<div class="flex items-center mb-2">
					<div class="w-[80px] text-right pr-3">Name:</div>
					<div>{name}</div>
				</div>
				<div class="flex items-center mb-2">
					<div class="w-[80px] text-right pr-3">ERC20:</div>
					<div>{addressPipe(address)}</div>
				</div>
				<div class="flex items-center mb-2">
					<div class="w-[80px] text-right pr-3">Price:</div>
					<div>{price} ETH</div>
				</div>
				<div class="flex items-center mb-2">
					<div class="w-[80px] text-right pr-3">Cover:</div>
					<img src={cover} alt="cover" class="w-40" />
				</div>
			</div>
		</div>
		<div class="lg:w-2/5 md:w-2/5 bg-gray-100 rounded lg:table-cell md:table-cell">
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

	{#if frameUrl || (frameUrl && isPublished)}
		<Tips {frameUrl} />
	{/if}
</div>
<div id="clipboard"></div>
<Toaster />

<style>
	.table {
		background-color: transparent;
	}
</style>
