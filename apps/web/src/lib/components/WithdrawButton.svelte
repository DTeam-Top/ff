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
	class="text-sm font-normal text-white bg-gray-700 p-2 ml-2 flex items-center gap-2 rounded-lg hover:bg-gray-500"
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
