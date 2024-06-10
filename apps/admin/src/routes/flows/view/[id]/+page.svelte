<script lang="ts">
	import { goto } from '$app/navigation';
	import { signed } from '$lib/client/utils';
	import { page } from '$app/stores';
	import ViewFlow from '$lib/components/flow/ViewFlow.svelte';
	$: if (!$signed) {
		console.log($signed);
		goto('/');
	}
</script>

<svelte:head>
	<title>View</title>
	<meta name="description" content="View flow" />
</svelte:head>
{#if $page.params.id}
	<ViewFlow farcasterId={$page.params.id} title="View" />
{/if}
