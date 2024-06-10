<script lang="ts">
	import { COMMISSIOM_MAX, WARPCAST_SETTING_URL, getBaseScanURL } from '$lib/client/clientConsts';
	import { getCommissionList } from '$lib/client/commissionService';
	import { addressPipe } from '$lib/client/utils';
	import { user } from '$lib/client/store';
	import dayjs from 'dayjs';
	import { formatEther } from 'ethers';
	import { createEventDispatcher, onMount } from 'svelte';
	import List from './List.svelte';
	export let needRefresh = false;
	let commissionList: any[] = [];
	let total = 0;
	let balance = 0;
	let loading = false;
	let offset: number = 0;
	let page = 0;
	let currentPage = 1;

	const dispatch = createEventDispatcher();
	onMount(() => {
		loading = true;
	});

	$: if ($user) {
		commissionList = [];
		refreshCommissionList();
	}

	$: if (needRefresh) {
		commissionList = [];
		refreshCommissionList();
	}

	const refreshCommissionList = () => {
		getCommissionList($user.fid, offset, COMMISSIOM_MAX).then((result) => {
			total = result.total;
			balance = result.balance;
			commissionList = [...commissionList, ...result.commissionList];
			page = Math.ceil(result.total / COMMISSIOM_MAX);
			loading = false;
			console.log('4444');
			dispatch('refresh', { result: false, total: total });
		});
	};

	const moreHandler = () => {
		if (currentPage < page) {
			currentPage += 1;
			offset = (currentPage - 1) * COMMISSIOM_MAX;
			console.log(currentPage, offset);
			refreshCommissionList();
		}
	};
</script>

<div class="flex justify-between my-4">
	{#if $user.verifiedAddresses.eth_addresses[0]}
		<div class="mb-4 text-green-300">
			Tips: Will withdraw to your verified address in farcaster: {addressPipe(
				$user.verifiedAddresses.eth_addresses[0]
			)}
		</div>
	{:else}
		<div class="mb-4 text-red-200">
			Tips: You have not set your verified address in farcaster, please go to <a
				href={WARPCAST_SETTING_URL}
				class="underline">Warpcast</a
			> to set.
		</div>
	{/if}
	<div class="text-white text-xl text-right">
		Total: {total}
		<span class="ml-8">Balance: {formatEther(balance)} <span class="text-sm">ETH</span></span>
	</div>
</div>

<List {commissionList} {page} {currentPage} on:load={moreHandler} />
