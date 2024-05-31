<script lang="ts">
	import { getCommissionList, postWithdraw } from '$lib/services/commissionService';
	import { WARPCAST_SETTING_URL, getBaseScanURL } from '$lib/services/constants';
	import { user } from '$lib/services/store';
	import { addressPipe } from '$lib/services/utils';
	import dayjs from 'dayjs';

	let commissionList: any[] = [];
	let total = 0;
	let balance = 0;

	$: if ($user) {
		console.log($user.verifiedAddresses.eth_addresses);
		refreshCommissionList();
	}

	const withdrawHandler = async () => {
		await postWithdraw($user.verifiedAddresses.eth_addresses[0], $user.fid);
		refreshCommissionList();
	};

	const refreshCommissionList = () => {
		getCommissionList($user.fid).then((result) => {
			console.log(result);
			commissionList = result.commissionList;
			total = result.total;
			balance = result.balance;
		});
	};
</script>

<div class="bg-gray-800 rounded-3xl px-6 pt-4 mt-4">
	<div class="flex justify-between items-end text-white text-2xl pb-6 font-bold">
		<p>My Comissions</p>
	</div>

	<div>
		<div class="border-t solid border-gray-700 p-4 w-full hover:bg-gray-700 text-white">
			<div class="py-2 flex justify-start items-center">
				<div class="text-sm font-normal mr-4">Total: {total}</div>
				<div class="text-sm font-normal">Balance: {balance} ETH</div>
			</div>
			{#if $user.verifiedAddresses.eth_addresses[0]}
				<div class="mb-4 text-green-300">
					Tips: Will withdraw to your verified address in farcaster: ${addressPipe(
						$user.verifiedAddresses.eth_addresses[0]
					)}
				</div>
				<button
					class="text-sm font-normal text-white bg-gray-700 p-2 ml-2 flex items-center gap-2 rounded-lg hover:bg-gray-500"
					on:click={withdrawHandler}
				>
					<img src="/images/withdraw.svg" alt="withdraw" class="w-6 h-6" />
					Withdraw</button
				>
			{:else}
				<div class="mb-4 text-red-200">
					Tips: You have not set your verified address in farcaster, please go to <a
						href={WARPCAST_SETTING_URL}
						class="underline">Warpcast</a
					> to set.
				</div>
			{/if}
		</div>

		{#each commissionList as item}
			<div class="border-t solid border-gray-700 p-4 flex 2xl:items-start w-full hover:bg-gray-700">
				<img src={item.cover} alt="profile" class="object-cover w-10 h-10 rounded-full" />
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
						{item.commission} ETH
					</p>
					<p class="text-right text-gray-400 text-sm">
						{dayjs(item.createdAt).format('YYYY, MMMM, DD')}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
