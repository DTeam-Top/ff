<script lang="ts">
	import Content from '$lib/components/Content.svelte';
	import Landing from '$lib/components/Landing.svelte';
	import { signed } from '$lib/client/store';
</script>

<svelte:head>
	<title>Farcaster Flow</title>
</svelte:head>

{#if $signed}
	<Content />
{:else}
	<Landing />
{/if}
