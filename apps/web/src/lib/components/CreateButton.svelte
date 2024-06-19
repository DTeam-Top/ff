<script lang="ts">
	import { goto } from '$app/navigation';
	import { connectWallet } from '$lib/client/etherService';
	import { user, walletAddress, provider } from '$lib/client/store';
	import FlowsIcon from './ui/icons/FlowsIcon.svelte';

	const gotoCreate = async () => {
		if (!$walletAddress) {
			await connectWallet($provider);
		}
		goto('/flows/create');
	};
	let disabled = false;
	$: if (
		$user.verifiedAddresses &&
		$user.verifiedAddresses.eth_addresses.length > 0 &&
		$user.verifiedAddresses.eth_addresses[0]
	) {
		disabled = false;
	} else {
		disabled = true;
	}
</script>

<button
	class="text-white bg-secondary-500 p-2 ml-2 flex items-center gap-2 rounded-lg font-bold hover:variant-soft-secondary"
	on:click={gotoCreate}
	{disabled}
>
	<svelte:component this={FlowsIcon} />
	Create Flow
</button>
