<script lang="ts">
	import { getCommissionList } from '$lib/client/commissionService';
	import { user } from '$lib/client/store';
	import { goto } from '$app/navigation';
	import { formatEther } from 'ethers';
	import { COMMISSIOM_MAX } from '$lib/client/clientConsts';
	import ListIcon from '$lib/components/ui/icons/ListIcon.svelte';
	let total = 0;
	let balance = 0;
	let offset: number = 0;

	$: if ($user) {
		refreshCommissionList();
	}

	const refreshCommissionList = () => {
		getCommissionList($user.fid, offset, COMMISSIOM_MAX).then((result) => {
			total = result.total;
			balance = result.balance;
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
				<div class="text-2xl">{formatEther(balance)} <span class="text-sm">ETH</span></div>
				<div class="opacity-50">Balance</div>
			</div>
		</div>
	</div>
</div>
