<script lang="ts">
	import { COMMISSIOM_MAX, getBaseScanURL } from '$lib/client/clientConsts';
	import { getHistoryList } from '$lib/client/commissionService';
	import { user } from '$lib/client/store';
	import dayjs from 'dayjs';
	import { formatEther } from 'ethers';
	import { createEventDispatcher } from 'svelte';

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
			console.log(555);
			dispatch('refresh', { result: false });
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

<div class="text-white my-4 text-xl text-right">
	Total: {total} <span class="ml-8">Balance: {formatEther(balance)} ETH</span>
</div>

{#if commissionList.length > 0}
	<div class="grid grid-cols-3 gap-4">
		{#each commissionList as item}
			<div
				class="border solid border-gray-700 p-4 flex 2xl:items-start w-full hover:bg-gray-800 bg-gray-700 rounded-lg"
			>
				<img src={item.cover} alt="cover" class="object-cover w-10 h-10 rounded-full" />
				<div class="pl-4 w-full">
					<div class="flex items-center justify-between w-full">
						<div class="text-white font-medium">{item.name}</div>
						<div class="flex justify-center items-center cursor-pointer h-7 w-7">
							<a target="_blank" href={`${getBaseScanURL()}/tx/${item.tx}`}
								><img src="/images/etherscan.png" alt="etherscan" /></a
							>
						</div>
					</div>
					<p class="my-2 text-sm text-gray-400">
						{formatEther(item.commission)} ETH
					</p>
					<p class="text-right text-gray-400 text-sm">
						{dayjs(item.withdrawnAt).format('YYYY, MMMM, DD')}
					</p>
				</div>
			</div>
		{/each}
	</div>
	{#if page > 0 && currentPage < page}
		<div class="py-4 text-white mx-auto w-[100px] text-center text-lg">
			<button on:click={moreHandler} class="underline cursor-pointer text-lg"> More </button>
		</div>
	{/if}
{:else}
	<!-- <div class="w-full text-center text-2xl my-8 text-white">There is no commissions.</div> -->
{/if}
