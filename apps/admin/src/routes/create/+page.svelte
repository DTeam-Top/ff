<script lang="ts">
	import { goto } from '$app/navigation';
	import { signed } from '$lib/services/utils';
	import CreateFlow from '$lib/components/CreateFlow.svelte';

	$: if (!$signed) {
		console.log($signed);
		goto('/');
	}
</script>

<svelte:head>
	<title>Create</title>
	<meta name="description" content="Create frame" />
</svelte:head>

<CreateFlow farcasterId={0} />
