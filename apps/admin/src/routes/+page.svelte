<script lang="ts">
  import { signed } from "$lib/services/utils";
  import Content from "$lib/components/Content.svelte";
  import Landing from "$lib/components/Landing.svelte";
</script>

<svelte:head>
  <title>Admin</title>
</svelte:head>

{#if $signed}
  <Content title="Status" />
{:else}
  <Landing />
{/if}
