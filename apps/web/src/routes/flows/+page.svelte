<script lang="ts">
	import { setFarcaster, setStatus, status, signed } from '$lib/client/store';
	import { onMount } from 'svelte';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { FLOW_TABS } from '$lib/client/clientConsts';
	import FlowList from '$lib/components/flow/FlowList.svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		setFarcaster({ id: 0 });
	});

	let tabSet: number = $status;
	const clickHandler = (i: number) => {
		tabSet = i;
		setStatus(tabSet);
	};

	$: if (!$signed) {
		goto('/');
	}
</script>

<svelte:head>
	<title>My Flows</title>
	<meta name="description" content="My flows" />
</svelte:head>

<section class="min-h-full m-4">
	<div class="w-full">
		<div class="flex justify-between">
			<div class="text-2xl font-bold">My Flows</div>
			<div class="flex flex-row-reverse text-right"><CreateButton /></div>
		</div>

		<TabGroup>
			{#each FLOW_TABS as tab, i}
				<Tab bind:group={tabSet} name="tab" value={i} on:click={() => clickHandler(i)}>{tab}</Tab>
			{/each}

			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<FlowList type="draft" />
				{:else if tabSet === 1}
					<FlowList type="published" />
				{:else if tabSet === 2}
					<FlowList type="unavailable" />
				{:else if tabSet === 3}
					<FlowList />
				{/if}
			</svelte:fragment>
		</TabGroup>
	</div>
</section>
