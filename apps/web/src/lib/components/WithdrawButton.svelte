<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';

	const dispatch = createEventDispatcher();
	export let loading = false;
	const withdrawHandler = () => {
		dispatch('withdraw');
	};
</script>

<button
	class="text-sm font-normal text-white bg-secondary-500 p-2 ml-2 flex items-center gap-2 rounded-lg hover:variant-soft-secondary"
	on:click={withdrawHandler}
	disabled={loading}
>
	{#if loading}
		<Loading />
	{:else}
		<img src="/images/withdraw.svg" alt="withdraw" class="w-6 h-6" />
	{/if}
	Withdraw
</button>
