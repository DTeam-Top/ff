<script lang="ts">
	import FrameButtons from '$lib/components/FrameButtons.svelte';
	import { getFlow, insertFlow, publishFlow } from '$lib/client/flowService';
	import { errorPipe, getPreviewUrl } from '$lib/client/utils';
	import { user, farcaster, setFarcaster } from '$lib/client/store';
	import { onMount } from 'svelte';
	import Tips from '../Tips.svelte';
	import { FRAME_BASE_URL, STATUS_PUBLISHED } from '$lib/client/clientConsts';
	import Button from '../Button.svelte';
	import { toast } from '$lib/client/popup';
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

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
		if (farcasterId.toString() !== 'uuid') {
			const flow = await getFlow(farcasterId);
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
				toast.error(toastStore, 'Wrong id');
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
				toast.error(toastStore, 'Please input name , ERC20 , cover');
				return;
			}

			await insertFlow({
				name: name,
				cover: cover,
				input: { price: price.toString(), address: address },
				creator: $user.fid,
				id: $farcaster.id
			});
			//toast.success('Save success!');
			toast.success(toastStore, 'Save success!');
		} catch (e: any) {
			//alert(e);
			console.log(e.response);
			toast.error(toastStore, errorPipe(e.response?.data?.message));
		}
	};

	const publishHandler = async () => {
		if ($farcaster.id !== 'uuid') {
			const result = await publishFlow($farcaster.id);
			frameUrl = `${FRAME_BASE_URL}/api/${$farcaster.id}`;
			isPublished = true;
		} else {
			toast.error(toastStore, 'Please save first!');
		}
	};
</script>

<div class="p-6 m-4 text-black">
	<ol class="breadcrumb mb-8">
		<li class="crumb"><a class="anchor" href="/flows">Flow list</a></li>
		<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
		<li class="text-white">{title} Flow</li>
	</ol>
	<section class="w-full max-w-[2000px] mx-auto border-spacing-x-8 table bg-transparent">
		<div class="lg:w-2/5 md:w-2/5 card lg:table-cell md:table-cell">
			<div class="py-4 px-6 mb-4 font-bold border-b border-surface-500/30 text-xl text-white">
				Design
			</div>
			<div class="px-6">
				<label class="flex items-center mb-2">
					<span>Name</span>
					<input
						class="input rounded w-4/5"
						placeholder="Flow name"
						bind:value={name}
						on:keyup={() => previewHandler()}
					/>
				</label>
				<label class="flex items-center mb-2">
					<span class="">ERC20</span>

					<input
						class="input rounded w-4/5"
						placeholder="ERC20 address"
						bind:value={address}
						on:keyup={() => previewHandler()}
					/>
				</label>

				<label class="flex items-center mb-2">
					<span>Price</span>
					<input
						class="input rounded w-1/4"
						bind:value={price}
						type="number"
						on:keyup={() => previewHandler()}
					/>
					<div class="bg-gray-300 px-4 py-2 font-bold rounded-r text-black">ETH</div>
				</label>

				<label class="flex items-center">
					<span>Cover</span>
					<textarea
						class="textarea w-4/5"
						rows="5"
						placeholder="Image's url"
						bind:value={cover}
						on:keyup={() => previewHandler()}
					/>
				</label>
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
	{#if !isPublished}
		<div class="flex mt-8 justify-center text-white">
			<Button cssClass="bg-gray-100 text-black" on:click={cancelHandler} title="Reset"></Button>
			<Button cssClass="bg-secondary-500 text-white mx-8 " on:click={saveHandler} title="Save"
			></Button>
			<Button cssClass="bg-primary-500 text-white  " on:click={publishHandler} title="Publish"
			></Button>
		</div>
	{/if}

	{#if frameUrl || (frameUrl && isPublished)}
		<Tips {frameUrl} />
	{/if}
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
