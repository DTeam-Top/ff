<script lang="ts">
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import { getFlow } from '$lib/client/secretService';
	import { farcaster, setFarcaster } from '$lib/client/store';
	import { onMount } from 'svelte';
	import { FRAME_BASE_URL, STATUS_PUBLISHED } from '$lib/client/clientConsts';
	import { toast } from '$lib/client/popup';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { getPreviewUrl } from '$lib/client/commonService';
	const toastStore = getToastStore();

	export let farcasterId = 'uuid';
	let frameUrl = '';
	let name: string = '';
	let addressList: any[] = [];
	let cover: string = '';
	let price: number = 0;
	let isPublished = false;
	let prviewImage = '';
	let loading = false;
	let newList: any[] = [];

	onMount(async () => {
		setFarcaster({ id: farcasterId });
		if (farcasterId.toString() !== 'uuid') {
			const flow = await getFlow(farcasterId);
			if (flow) {
				name = flow.name;
				price = flow.input?.price;
				cover = flow.cover;
				isPublished = flow.status === STATUS_PUBLISHED;
				if (isPublished) {
					frameUrl = `${FRAME_BASE_URL}/api/${$farcaster.id}`;
				}
			} else {
				toast.error(toastStore, 'Wrong id');
			}
		} else {
			name = 'test'; //'test';
			addressList = [
				{ type: 'ERC20', address: '0xf1731D81BC7be92DBD9b759a63ECAFaA569C7D0a', amount: 1 },
				{ type: 'ERC721', address: '0xce8fec9a10d4642368f124593098f2e4dd643652', tokenId: 2 },
				{
					type: 'ERC1155',
					address: '0x2F6F12b68165aBb483484927919D0d3fE450462E',
					tokenId: 2,
					amount: 3
				}
			]; //'0x2F6F12b68165aBb483484927919D0d3fE450462E';
			cover =
				'https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png'; //'https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png';
			price = 0.005; //0.005;
		}
		newList = addressList;
		previewHandler();
	});

	const previewHandler = async () => {
		if (!name || !cover) {
			return;
		}
		loading = true;

		frameUrl = '';
		prviewImage = await getPreviewUrl(FRAME_BASE_URL, name, cover, price);
		loading = false;
	};
</script>

<div class="px-6">
	{#if loading}
		Loading ...
	{:else if prviewImage}
		<div class="border border-gray-700 rounded-3xl p-4">
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
		</div>
	{/if}
</div>
