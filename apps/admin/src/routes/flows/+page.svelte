<script lang="ts">
	import { setFarcaster } from '$lib/client/store';
	import { onMount } from 'svelte';
	import CreateButton from '$lib/components/CreateButton.svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { FLOW_TABS } from '$lib/client/clientConsts';
	import FlowList from '$lib/components/flow/FlowList.svelte';
	onMount(() => {
		setFarcaster({ id: 0 });
	});

	let tabSet: number = 0;
</script>

<svelte:head>
	<title>My Flows</title>
	<meta name="description" content="My flows" />
</svelte:head>

<section class="min-h-full m-4 p-6">
	<div class="w-full">
		<div class="flex justify-between">
			<div class="text-2xl font-bold">My Flows</div>
			<div class="flex flex-row-reverse text-right"><CreateButton /></div>
		</div>

		<TabGroup>
			{#each FLOW_TABS as tab, i}
				<Tab bind:group={tabSet} name="tab2" value={i}>{tab}</Tab>
			{/each}

			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<FlowList type="draft" />
				{:else if tabSet === 1}
					<FlowList type="published" />
				{:else if tabSet === 2}
					<FlowList />
				{/if}
			</svelte:fragment>
		</TabGroup>
	</div>
</section>
