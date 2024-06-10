<script lang="ts">
	import { goto } from '$app/navigation';
	import { signed } from '$lib/client/utils';
	import CreateFlow from '$lib/components/flow/CreateFlow.svelte';

	$: if (!$signed) {
		goto('/');
	}
</script>

<svelte:head>
	<title>Create</title>
	<meta name="description" content="Create flow" />
</svelte:head>

<CreateFlow farcasterId={'uuid'} title="Create" />
