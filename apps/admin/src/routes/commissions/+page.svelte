<script lang="ts">
	import { signed } from '$lib/client/utils';
	import WithdrawButton from '$lib/components/WithdrawButton.svelte';
	import HistoryList from '$lib/components/commission/HistoryList.svelte';
	import AvaliableList from '$lib/components/commission/AvaliableList.svelte';
	import { goto } from '$app/navigation';
	import { postWithdraw } from '$lib/client/commissionService';
	import { user } from '$lib/client/store';
	import { COMISSION_TABS } from '$lib/client/clientConsts';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';

	let loading = false;
	let needRefresh = false;
	let canWithdraw = false;
	let currentTab = 0;
	const modalStore = getModalStore();
	$: if (!$signed) {
		goto('/');
	}

	const withdrawHandler = async () => {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Delete Confirm',
			body: 'Are you sure to delete?',
			response: async (r: boolean) => {
				console.log('response:', r);

				if (r) {
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
			}
		};
		modalStore.trigger(modal);
	};

	const changeTabHandler = (i: number) => {
		currentTab = i;
	};

	const changeRefresh = (el: any) => {
		console.log(el.detail);
		needRefresh = el.detail.result;
		canWithdraw = el.detail.total > 0;
	};
	let tabSet: number = 0;
</script>

<svelte:head>
	<title>My Commissions</title>
	<meta name="description" content="My commissions" />
</svelte:head>

<section class="min-h-full p-6 m-4">
	<div class="w-full">
		<div class="flex justify-between text-white">
			<div class="text-2xl font-bold">My Commissions</div>
			{#if canWithdraw}
				<div class="flex flex-row-reverse text-right">
					<WithdrawButton on:withdraw={withdrawHandler} {loading} />
				</div>
			{/if}
		</div>
		<TabGroup>
			{#each COMISSION_TABS as tab, i}
				<Tab bind:group={tabSet} name="tab2" value={i}>{tab}</Tab>
			{/each}

			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<AvaliableList {needRefresh} on:refresh={changeRefresh} />
				{:else if tabSet === 1}
					<HistoryList {needRefresh} on:refresh={changeRefresh} />
				{/if}
			</svelte:fragment>
		</TabGroup>
	</div>
</section>
