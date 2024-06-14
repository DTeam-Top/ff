<script lang="ts">
	import SWIN from '$lib/components/SWIN.svelte';
	import { user, removeItem, signed } from '$lib/client/store';
	import WalletButton from '../WalletButton.svelte';
	import SocialLinks from '../SocialLinks.svelte';
	const onSingout = () => {
		removeItem('user', window);
		window.location.reload();
	};
</script>

{#if $signed}
	<SocialLinks />
	<span class="block"
		><img
			alt="User"
			src={$user.pft}
			class="h-8 mx-auto object-cover rounded-full w-8 bg-white"
		/></span
	>

	<WalletButton />
	<button
		on:click={onSingout}
		class="border border-primary-800 rounded-lg px-4 py-2 hover:variant-soft-primary"
		>Sign out</button
	>
{:else}
	<a class="hover:variant-soft-primary rounded-lg px-4 py-2" href="/browse">Browse</a>
	<SocialLinks />
	<!-- <button>Flows</button> -->
	<SWIN />
{/if}
