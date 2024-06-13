<script lang="ts">
	import { page } from '$app/stores';
	import ViewFlow from '$lib/components/flow/ViewFlow.svelte';
</script>

<svelte:head>
	<title>View</title>
	<meta name="description" content="View flow" />
</svelte:head>
{#if $page.params.id}
	<ViewFlow farcasterId={$page.params.id} title="View" />
{/if}
