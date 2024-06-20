<script lang="ts">
	import { COMMISSIOM_MAX } from '$lib/client/clientConsts';
	import { getHistoryList } from '$lib/client/secretService';
	import { user } from '$lib/client/store';
	import { formatEther } from 'ethers';
	import { createEventDispatcher } from 'svelte';
	import List from './List.svelte';
	import ETH from '$lib/components/ETH.svelte';

	export let needRefresh = false;
	let commissionList: any[] = [];
	let total = 0;
	let balance = 0;
	let offset: number = 0;
	let page = 0;
	let currentPage = 1;
	const dispatch = createEventDispatcher();

	$: if (needRefresh) {
		refreshCommissionList();
	}

	$: if ($user) {
		refreshCommissionList();
	}

	const refreshCommissionList = () => {
		getHistoryList($user.fid, offset, COMMISSIOM_MAX).then((result) => {
			total = result.total;
			balance = result.balance;
			commissionList = [...commissionList, ...result.commissionList];
			page = Math.ceil(result.total / COMMISSIOM_MAX);
			dispatch('refresh', { result: false });
		});
	};

	const moreHandler = () => {
		if (currentPage < page) {
			currentPage += 1;
			offset = (currentPage - 1) * COMMISSIOM_MAX;
			refreshCommissionList();
		}
	};
</script>

<div class="text-white my-4 text-xl text-right">
	Total: {total}
	<span class="ml-8">Balance: {formatEther(balance)} <ETH /></span>
</div>
<List {commissionList} {page} {currentPage} on:load={moreHandler} />
