<script lang="ts">
	import { goto } from '$app/navigation';
	import CreateFlow from '$lib/components/flow/CreateFlow.svelte';
	import { signed } from '$lib/client/store';

	$: if (!$signed) {
		goto('/');
	}
</script>

<svelte:head>
	<title>Create Flow</title>
	<meta name="description" content="Create flow" />
</svelte:head>

<CreateFlow farcasterId={'uuid'} title="Create" />
