<script lang="ts">
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import { getFlow, insertFlow, publishFlow } from '$lib/client/secretService';
	import { errorPipe } from '$lib/client/utils';
	import { user, farcaster, setFarcaster, walletAddress } from '$lib/client/store';
	import { onMount } from 'svelte';
	import Tips from '$lib/components/Tips.svelte';
	import {
		CREATE_TABS,
		FRAME_BASE_URL,
		STATUS_PUBLISHED,
		TOKEN_TABS
	} from '$lib/client/clientConsts';
	import Button from '../Button.svelte';
	import { toast } from '$lib/client/popup';
	import { Tab, TabGroup, getToastStore } from '@skeletonlabs/skeleton';
	import TokenList from './TokenList.svelte';
	import { goto } from '$app/navigation';
	import TokenTip from './TokenTip.svelte';
	import { getPreviewUrl } from '$lib/client/commonService';
	import Spin from '../Spin.svelte';
	const toastStore = getToastStore();

	export let farcasterId = 'uuid';
	export let title = 'Create';
	let frameUrl = '';
	let name: string = '';
	let addressList: any[] = [];
	let cover: string = '';
	let price: number = 0;
	let isPublished = false;

	let prviewImage = '';
	let loading = false;
	let tabSet = 0;
	let tokenTabSet = 0;
	let ERC20List: any[] = [];
	let ERC721List: any[] = [];
	let ERC1155List: any[] = [];

	onMount(async () => {
		setFarcaster({ id: farcasterId });
		if (farcasterId.toString() !== 'uuid') {
			const flow = await getFlow(farcasterId);
			if (flow) {
				name = flow.name;
				addressList = flow.input?.addressList;
				price = flow.input?.price;
				cover = flow.cover;
				isPublished = flow.status === STATUS_PUBLISHED;
				if (isPublished) {
					frameUrl = `${FRAME_BASE_URL}/api/${$farcaster.id}`;
				}
				ERC20List = flow.input.addressList.filter((item: any) => item.type === 'ERC20');
				ERC721List = flow.input.addressList.filter((item: any) => item.type === 'ERC721');
				ERC1155List = flow.input.addressList.filter((item: any) => item.type === 'ERC1155');
			} else {
				toast.error(toastStore, 'Wrong id');
			}
		} else {
			name = ''; //'test';
			addressList = [];
			cover = '';
			//https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png
			//price = 0; //0.005;
		}
	});

	const cancelHandler = () => {
		name = '';
		addressList = [];
		cover = '';
		price = 0;
		prviewImage = '';
		ERC20List = [];
		ERC721List = [];
		ERC1155List = [];
	};

	const previewHandler = async () => {
		if (!name || !cover) {
			return;
		}
		frameUrl = '';
		return await getPreviewUrl(FRAME_BASE_URL, name, cover, price);
	};

	const saveHandler = async () => {
		try {
			addressList = [...ERC20List, ...ERC721List, ...ERC1155List];
			if (!name || addressList.length === 0 || !cover) {
				toast.error(toastStore, 'Please input name , addresses , cover');
				return;
			}

			if (price < 0) {
				toast.error(toastStore, 'The price should be larger than 0');
				return;
			}

			await insertFlow({
				name: name,
				cover: cover,
				input: { price: price.toString(), addressList: addressList },
				creator: $user.fid,
				id: $farcaster.id,
				seller: $walletAddress
			});
			toast.success(toastStore, 'Save success!');
		} catch (e: any) {
			toast.error(toastStore, errorPipe(e.response?.data?.message));
		}
	};

	const publishHandler = async () => {
		if ($farcaster.id !== 'uuid') {
			await publishFlow($farcaster.id);
			frameUrl = `${FRAME_BASE_URL}/api/${$farcaster.id}`;
			isPublished = true;
			goto(`/flows/view/${$farcaster.id}`);
		} else {
			toast.error(toastStore, 'Please save first!');
		}
	};

	$: if (tabSet === 1) {
		loading = true;
		previewHandler().then((url) => {
			if (url) {
				prviewImage = url;
			}
			loading = false;
		});
	}
</script>

<div class="p-6 text-black">
	<ol class="breadcrumb mb-8">
		<li class="crumb"><a class="anchor" href="/flows">Flow list</a></li>
		<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
		<li class="text-white">{title} Flow</li>
	</ol>
	<section class="w-full max-w-[2000px] mx-auto bg-transparent text-white">
		<TabGroup class="w-full">
			{#each CREATE_TABS as tab, i}
				<Tab bind:group={tabSet} name="tab" value={i}>{tab}</Tab>
			{/each}

			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<div class="w-full">
						<div class="flex justify-start mb-4">
							<label class="flex items-center mr-8 w-[400px]">
								<span>Name</span>
								<input class="input rounded" placeholder="Flow name" bind:value={name} />
							</label>

							<label class="flex items-center">
								<span>Price</span>
								<input class="input rounded w-2/5" bind:value={price} type="number" />
								<div class="bg-gray-300 px-4 py-2 font-bold rounded-r text-black">ETH</div>
							</label>
						</div>
						<div class="flex justify-start items-start mb-4">
							<label class="flex items-start w-[400px] mr-8">
								<span>Cover</span>
								<textarea class="textarea" rows="5" placeholder="Image's url" bind:value={cover} />
							</label>
							<label class="flex items-start">
								<span>Preview</span>
								{#if cover}
									<img src={cover} alt="corver" class="w-[400px]" />
								{:else}
									<img src="/images/placeholder.png" alt="corver" class="w-40 bg-gray-300" />
								{/if}
							</label>
						</div>
					</div>
					<hr />
					<TabGroup class="w-full relative">
						{#each TOKEN_TABS as tab, i}
							<Tab bind:group={tokenTabSet} name={`tab${i}`} value={i}>{tab}</Tab>
						{/each}

						<svelte:fragment slot="panel">
							{#if tokenTabSet === 0}
								<TokenList bind:value={ERC20List} type="ERC20" />
							{:else if tokenTabSet === 1}
								<TokenList bind:value={ERC721List} type="ERC721" />
							{:else}
								<TokenList bind:value={ERC1155List} type="ERC1155" />
							{/if}
						</svelte:fragment>

						<TokenTip cssClass="hidden lg:block lg:absolute right-10 top-14" />
					</TabGroup>
					<TokenTip cssClass="lg:hidden" />
					<div class="lg:w-3/5 md:w-3/5 text-white mt-2">
						{#if !isPublished}
							<div class="flex mt-8 justify-center text-white">
								<Button cssClass="bg-gray-100 text-black" on:click={cancelHandler} title="Reset"
								></Button>
								<Button
									cssClass="bg-secondary-500 text-white mx-8 "
									on:click={saveHandler}
									title="Save"
								></Button>
								<Button
									cssClass="bg-primary-500 text-white  "
									on:click={publishHandler}
									title="Publish"
								></Button>
							</div>
						{/if}

						{#if frameUrl || (frameUrl && isPublished)}
							<Tips {frameUrl} />
						{/if}
					</div>
				{:else if tabSet === 1}
					<div class="px-6">
						{#if loading}
							<Spin />
						{:else if prviewImage}
							<div class="border border-gray-700 rounded-3xl p-4 w-3/5 mx-auto">
								<div class="relative rounded-lg relative w-full mb-4 pb-4 bg-[#f3f3f3]">
									<img
										class="bg-background-200 max-h-[532px] object-cover rounded-t-lg text-background-200 w-full"
										src={prviewImage}
										alt="Preview Frame"
									/>
									<FrameButtons />
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</svelte:fragment>
		</TabGroup>
	</section>
</div>
<div id="clipboard"></div>

<style>
	textarea {
		resize: none;
	}
	textarea:focus,
	input:focus {
		outline: none;
	}
	.table {
		background-color: transparent;
	}

	label {
		color: white;
	}

	label > span {
		width: 80px;
		/*text-align: right;
		padding-right: 8px; */
		color: white;
	}
</style>
