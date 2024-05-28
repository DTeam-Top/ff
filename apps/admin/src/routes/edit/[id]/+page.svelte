<script lang="ts">
	import { goto } from '$app/navigation';
	import { signed } from '$lib/services/utils';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import CreateFlow from '$lib/components/CreateFlow.svelte';
	// let farcasterId = 0;

	// // onMount(async () => {
	// // 	farcasterId = Number($page.params.id);
	// // });
	// $: if ($page.params.id) {
	// 	farcasterId = Number($page.params.id);
	// }

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
	<CreateFlow farcasterId={Number($page.params.id)} />
{/if}
