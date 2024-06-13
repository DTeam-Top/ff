<script lang="ts">
	import Content from '$lib/components/Content.svelte';
	import Landing from '$lib/components/Landing.svelte';
	import { signed } from '$lib/client/store';
</script>

<svelte:head>
	<title>Admin</title>
</svelte:head>

{#if $signed}
	<Content title="My Flows" />
{:else}
	<Landing />
{/if}
