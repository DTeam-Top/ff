<script lang="ts">
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import { getFlow } from '$lib/client/secretService';
	import { addressPipe, getPreviewUrl } from '$lib/client/utils';
	import { farcaster, setFarcaster, signed } from '$lib/client/store';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { FRAME_BASE_URL, STATUS_PUBLISHED } from '$lib/client/clientConsts';
	import Tips from '$lib/components/Tips.svelte';
	import { toast } from '$lib/client/popup';
	import ListIcon from '$lib/components/ui/icons/ListIcon.svelte';
	import ETH from '$lib/components/ETH.svelte';
	const toastStore = getToastStore();

	export let farcasterId = 'uuid';
	export let title = 'Create';
	let frameUrl = '';
	let isPublished = false;
	let prviewImage = '';
	let loading = false;
	let flow: any;

	onMount(async () => {
		setFarcaster({ id: farcasterId });
		flow = await getFlow(farcasterId);
		if (flow) {
			isPublished = flow.status === STATUS_PUBLISHED;
			if (isPublished) {
				frameUrl = `${FRAME_BASE_URL}/api/${$farcaster.id}`;
			}
			previewHandler();
		} else {
			toast.error(toastStore, 'Wrong id');
		}
	});

	const previewHandler = async () => {
		if (!flow.name || !flow.cover) {
			return;
		}
		loading = true;
		prviewImage = await getPreviewUrl(FRAME_BASE_URL, flow.name, flow.cover, flow.input.price);
		loading = false;
	};
</script>

<div class="p-6 m-4 text-black">
	{#if $signed}
		<ol class="breadcrumb mb-8">
			<li class="crumb"><a class="anchor" href="/flows">Flow list</a></li>
			<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
			<li class="text-white">{title} Flow</li>
		</ol>
	{/if}
	<section class="w-full max-w-[2000px] mx-auto border-spacing-x-8 table bg-transparent">
		<div class="lg:w-2/5 md:w-2/5 card lg:table-cell md:table-cell text-white">
			<div class="py-4 px-6 mb-4 font-bold border-b border-surface-500/30 text-xl">Design</div>
			{#if flow}
				<div class="px-6">
					<div class="flex items-center mb-2">
						<div class="w-[80px] text-right pr-3">Name:</div>
						<div>{flow.name}</div>
					</div>
					<div class="flex items-center mb-2">
						<div class="w-[80px] text-right pr-3">Price:</div>
						<div>{flow.input.price} <ETH /></div>
					</div>
					<div class="flex items-center mb-2">
						<div class="w-[80px] text-right pr-3">Cover:</div>
						<img src={flow.cover} alt="cover" class="w-40" />
					</div>
					{#each flow.input.addressList as token}
						<div class="flex items-center mb-2">
							<div class="w-[80px] text-right pr-3">{token.type}:</div>
							<div>{addressPipe(token.address)}</div>
							{#if token.amount}
								<div class="ml-4">Amount:&nbsp;&nbsp;&nbsp;&nbsp;{token.amount}</div>
							{/if}
							{#if token.tokenId}
								<div class="ml-4">TokenId:&nbsp;&nbsp;&nbsp;{token.tokenId}</div>
							{/if}
						</div>
					{/each}
					<div class="flex items-center mb-2">
						<div class="w-[80px] text-right pr-3">Traces:</div>
						<div class="flex">
							{flow.traceCount}
							{#if $signed}
								<a
									href={`/flows/trace/${flow.id}`}
									class="ml-8 underline cursor-pointer text-primary-500 hover:text-primary-300"
									><svelte:component this={ListIcon} /></a
								>
							{/if}
						</div>
					</div>
				</div>
			{/if}
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

<style>
	.table {
		background-color: transparent;
	}
</style>
