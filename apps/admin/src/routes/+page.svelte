<script lang="ts">
	import { signed } from '$lib/client/utils';
	import Content from '$lib/components/Content.svelte';
	import Landing from '$lib/components/Landing.svelte';
</script>

<svelte:head>
	<title>Admin</title>
</svelte:head>

{#if $signed}
	<Content title="My Flows" />
{:else}
	<Landing />
{/if}
