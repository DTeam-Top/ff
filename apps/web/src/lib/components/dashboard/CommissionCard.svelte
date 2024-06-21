<script lang="ts">
	import { getCommissionList } from '$lib/client/secretService';
	import { user } from '$lib/client/store';
	import { goto } from '$app/navigation';
	import { formatEther } from 'ethers';
	import ListIcon from '$lib/components/ui/icons/ListIcon.svelte';
	import ETH from '$lib/components/ETH.svelte';
	import dayjs from 'dayjs';
	import { getBaseScanURL } from '$lib/client/clientConsts';
	let total = 0;
	let balance = 0;
	let offset: number = 0;
	let list: any[] = [];

	$: if ($user && $user.fid > 0) {
		refreshCommissionList();
	}

	const refreshCommissionList = () => {
		getCommissionList($user.fid, offset, 5).then((result) => {
			total = result.total;
			balance = result.balance;
			list = result.commissionList;
		});
	};

	const listHandler = () => {
		goto('/commissions');
	};
</script>

<div class=" px-6 pt-4 mt-4 hover:bg-primary-hover-token">
	<header class="flex justify-between items-center pb-4 border-b solid border-gray-700">
		<h3>My Commissions</h3>
		<div>
			<button
				class="text-primary-500 bg-transparent hover:text-primary-300"
				title="List View"
				on:click={listHandler}
			>
				<svelte:component this={ListIcon} />
			</button>
		</div>
	</header>

	<div class="py-4 w-full">
		<div class="grid grid-cols-2 gap-8 text-center">
			<div>
				<div class="text-2xl">{total}</div>
				<div class="opacity-50">Total</div>
			</div>
			<div>
				<div class="text-2xl">
					{formatEther(balance)}
					<ETH />
				</div>
				<div class="opacity-50">Availible Balance</div>
			</div>
		</div>
	</div>
	<div>
		{#each list as commission}
			<div class="flex w-full border-t border-gray-700 p-4 hover:bg-gray-700 2xl:items-start">
				<img src={commission.cover} alt="cover" class="h-10 w-10 rounded object-cover" />
				<div class="w-full pl-4">
					<div class="flex w-full items-center justify-between">
						<div class="font-medium text-white">{commission.name}</div>
						<div class="flex h-7 w-7 cursor-pointer items-center justify-center">
							<a target="_blank" href={`${getBaseScanURL()}/tx/${commission.tx}`}
								><img src="/images/etherscan.png" alt="etherscan" /></a
							>
						</div>
					</div>
					<p class="my-2 text-sm text-gray-400">
						{formatEther(commission.commission)}
						<ETH />
					</p>
					<p class="text-right text-sm text-gray-400">
						{dayjs(commission.createdAt).format('MMMM, DD')}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
