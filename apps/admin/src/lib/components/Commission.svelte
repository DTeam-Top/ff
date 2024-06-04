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

<div class="bg-gray-800 rounded-3xl px-6 pt-4 mt-4">
	<div class="flex justify-between items-end text-white text-2xl pb-4 font-bold">
		<p>My Commissions</p>
		<div>
			<button class="text-white bg-transparent" title="List View" on:click={listHandler}>
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
	</div>

	<div>
		<div class="border-t solid border-gray-700 p-4 w-full hover:bg-gray-700 text-white">
			<div class="py-2 text-2xl">
				<div class="font-normal mr-4">Total: {total}</div>
				<div class="font-normal">Balance: {formatEther(balance)} ETH</div>
			</div>
		</div>
	</div>
</div>
