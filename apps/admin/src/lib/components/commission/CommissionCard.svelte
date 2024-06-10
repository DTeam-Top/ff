<script lang="ts">
	import { getCommissionList } from '$lib/client/commissionService';
	import { user } from '$lib/client/store';
	import { goto } from '$app/navigation';
	import { formatEther } from 'ethers';
	import { COMMISSIOM_MAX } from '$lib/client/clientConsts';
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
			<button class="text-primary-500 bg-transparent" title="List View" on:click={listHandler}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="8" y1="6" x2="21" y2="6" />
					<line x1="8" y1="12" x2="21" y2="12" />
					<line x1="8" y1="18" x2="21" y2="18" />
					<line x1="3" y1="6" x2="3.01" y2="6" />
					<line x1="3" y1="12" x2="3.01" y2="12" />
					<line x1="3" y1="18" x2="3.01" y2="18" />
				</svg>
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
