<script lang="ts">
	import { signed } from '$lib/client/utils';
	import { dialogs } from 'svelte-dialogs';
	import WithdrawButton from '$lib/components/WithdrawButton.svelte';
	import HistoryList from '$lib/components/HistoryList.svelte';
	import AvaliableList from '$lib/components/AvaliableList.svelte';
	import { goto } from '$app/navigation';
	import { postWithdraw } from '$lib/client/commissionService';
	import { user } from '$lib/client/store';
	import { TABS } from '$lib/client/clientConsts';

	let loading = false;
	let needRefresh = false;
	let canWithdraw = false;

	let currentTab = 0;
	$: if (!$signed) {
		goto('/');
	}

	const withdrawHandler = async () => {
		const confirm = await dialogs.confirm({
			title: 'Are you sure to withdraw?',
			closeButton: true,
			confirmButtonText: 'Sure',
			declineButtonText: 'Cancel'
		});

		if (confirm) {
			try {
				loading = true;
				await postWithdraw($user.verifiedAddresses.eth_addresses[0], $user.fid);
				needRefresh = true;
			} catch (e: any) {
				console.log(e.message);
			} finally {
				loading = false;
			}
		}
	};

	const changeTabHandler = (i: number) => {
		currentTab = i;
	};

	const changeRefresh = (el: any) => {
		console.log(el.detail);
		needRefresh = el.detail.result;
		canWithdraw = el.detail.total > 0;
	};
</script>

<svelte:head>
	<title>My Commissions</title>
	<meta name="description" content="Create frame" />
</svelte:head>

<section class="w-full bg-gray-800 min-h-full py-6 px-6 rounded-3xl">
	<div class="w-full">
		<div class="flex justify-between text-white">
			<div class="text-2xl font-bold">My Commissions</div>
			{#if canWithdraw}
				<div class="flex flex-row-reverse text-right">
					<WithdrawButton on:withdraw={withdrawHandler} {loading} />
				</div>
			{/if}
		</div>

		<div class="tabs w-full text-white mt-4 border-b">
			{#each TABS as tab, i}
				<a
					class="tab {currentTab === i ? 'tab-active' : ''} tab-lifted"
					on:click={() => changeTabHandler(i)}>{tab}</a
				>
			{/each}
		</div>

		<div class="overflow-x-auto">
			{#if currentTab === 0}
				<AvaliableList {needRefresh} on:refresh={changeRefresh} />
			{:else if currentTab === 1}
				<HistoryList {needRefresh} on:refresh={changeRefresh} />
			{/if}
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		/* flex-direction: column; */
		justify-content: center;
		align-items: center;
		align-items: start;
		/* flex: 0.6; */
	}
</style>
