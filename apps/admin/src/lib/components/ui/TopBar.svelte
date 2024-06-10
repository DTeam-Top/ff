<script lang="ts">
	import SWIN from '$lib/components/SWIN.svelte';
	import { removeItem, signed } from '$lib/client/utils';
	import { user } from '$lib/client/store';
	const onSingout = () => {
		removeItem('user', window);
		window.location.reload();
	};
</script>

{#if $signed}
	<span class="block"
		><img
			alt="User"
			src={$user.pft}
			class="h-8 mx-auto object-cover rounded-full w-8 bg-white"
		/></span
	>
	<button on:click={onSingout} class=" hover:rounded-lg px-4 py-2 hover:variant-soft-primary"
		>Sign out</button
	>
{:else}
	<!-- <button>Flows</button> -->
	<SWIN />
{/if}
