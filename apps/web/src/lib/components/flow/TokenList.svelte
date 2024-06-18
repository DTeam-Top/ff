<script lang="ts">
	import { approve, prepareAddressData, validateData } from '$lib/client/utils';
	import { onMount } from 'svelte';
	import { toast } from '$lib/client/popup';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import TrashIcon from '$lib/components/ui/icons/TrashIcon.svelte';
	import PlusIcon from '$lib/components/ui/icons/PlusIcon.svelte';
	import { walletAddress, ethProvider } from '$lib/client/store';
	import Loading from '$lib/components/Loading.svelte';
	const toastStore = getToastStore();

	export let value: any[] = [];
	export let type: string = 'ERC20';

	let newAddress: string = '';
	let newAmount = '';
	let newTokenId = '';
	let addressList: any[] = [];
	let totalAmount = 0;
	let loading = false;
	onMount(async () => {
		addressList = value;
	});

	const addAddressHandler = async () => {
		loading = true;
		totalAmount =
			Number(newAmount) + addressList.reduce((sum, current) => sum + Number(current.amount), 0);

		const validate = await validateData(
			type,
			newAddress,
			totalAmount.toString(),
			newTokenId,
			$walletAddress,
			$ethProvider
		);
		if (validate) {
			toast.error(toastStore, validate);
			loading = false;
			return;
		}

		const isApproved = await approve(
			type,
			newAddress,
			totalAmount.toString(),
			newTokenId,
			$walletAddress,
			$ethProvider
		);

		if (!isApproved) {
			toast.error(toastStore, 'You have no right to add this address');
			loading = false;
			return;
		}
		loading = false;

		let newLine = {};

		newLine = prepareAddressData(type, newAddress, newAmount, newTokenId);
		addressList.push(newLine);
		value = addressList;
		initData();
	};
	const initData = () => {
		newAddress = '';
		newAmount = '';
		newTokenId = '';
	};

	const deleteAddressHandler = (index: number) => {
		addressList.splice(index, 1);
		console.log(addressList);
		value = addressList;
	};
</script>

<div class="px-6 w-full mt-4">
	{#each value as el, index}
		<div class="flex items-center mb-3">
			<div class="w-[450px] mr-2">{el.address}</div>
			<div class="w-[100px]">
				{type !== 'ERC20' ? el.tokenId : el.amount}
			</div>
			{#if type === 'ERC1155'}
				<div class="w-[100px] ml-2">{el.amount}</div>
			{/if}
			<div
				class="text-primary-500 cursor-pointer ml-2"
				on:click={() => deleteAddressHandler(index)}
			>
				<svelte:component this={TrashIcon} />
			</div>
		</div>
	{/each}
	<div>
		<label class="flex items-center mb-6">
			<input class="input rounded w-[450px] mr-2" bind:value={newAddress} placeholder="Address" />
			{#if type !== 'ERC20'}
				<input class="input rounded w-[100px] mr-2" bind:value={newTokenId} placeholder="TokenId" />
			{/if}
			{#if type !== 'ERC721'}
				<input class="input rounded w-[100px]" bind:value={newAmount} placeholder="Amount" />
			{/if}

			<div class="text-primary-500 cursor-pointer ml-2" on:click={addAddressHandler}>
				{#if loading}
					<Loading />
				{:else}
					<svelte:component this={PlusIcon} />
				{/if}
			</div>
		</label>
	</div>
</div>

<style>
	input:focus {
		outline: none;
	}

	label {
		color: white;
	}
</style>
