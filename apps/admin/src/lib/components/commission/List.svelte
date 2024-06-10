<script lang="ts">
	import { getBaseScanURL } from '$lib/client/clientConsts';
	import dayjs from 'dayjs';
	import { formatEther } from 'ethers';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let commissionList: any[] = [];
	export let page = 0;
	export let currentPage = 1;
	export let type = 'history';

	const moreHandler = () => {
		dispatch('load');
	};
</script>

{#if commissionList.length > 0}
	<div class="grid grid-cols-3 gap-4">
		{#each commissionList as item}
			<div
				class="border solid border-gray-700 p-4 flex 2xl:items-start w-full hover:bg-gray-800 bg-gray-500 rounded-lg"
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
						{#if type === 'history'}
							{item.withdrawnAt ? dayjs(item.withdrawnAt).format('YYYY, MMMM, DD') : 'Pending'}
						{:else}
							{dayjs(item.createdAt).format('YYYY, MMMM, DD')}
						{/if}
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
{/if}
