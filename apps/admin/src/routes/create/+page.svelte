<script lang="ts">
	import { goto } from '$app/navigation';
	import { signed } from '$lib/client/utils';
	import CreateFlow from '$lib/components/CreateFlow.svelte';

	$: if (!$signed) {
		goto('/');
	}
</script>

<svelte:head>
	<title>Create</title>
	<meta name="description" content="Create frame" />
</svelte:head>

<CreateFlow farcasterId={'uuid'} title="Create" />
