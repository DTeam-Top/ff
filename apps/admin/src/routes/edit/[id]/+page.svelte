<script lang="ts">
	import { goto } from '$app/navigation';
	import { signed } from '$lib/client/utils';
	import { page } from '$app/stores';
	import CreateFlow from '$lib/components/CreateFlow.svelte';
	$: if (!$signed) {
		console.log($signed);
		goto('/');
	}
</script>

<svelte:head>
	<title>Edit</title>
	<meta name="description" content="Create frame" />
</svelte:head>
{#if $page.params.id}
	<CreateFlow farcasterId={$page.params.id} title="Edit" />
{/if}
