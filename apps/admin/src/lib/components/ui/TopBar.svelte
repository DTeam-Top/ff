<script lang="ts">
	import SWIN from '$lib/components/SWIN.svelte';
	import { user, removeItem, signed } from '$lib/client/store';
	import WalletButton from '../WalletButton.svelte';
	import SocialLinks from '../SocialLinks.svelte';
	import SignoutIcon from './icons/SignoutIcon.svelte';
	const onSingout = () => {
		removeItem('user', window);
		window.location.reload();
	};
</script>

{#if $signed}
	<SocialLinks />

	<WalletButton />
	<button
		on:click={onSingout}
		class="flex gap-2 border border-[#495A8C] rounded items-center h-[48px] px-[15px] hover:variant-soft-primary"
	>
		<span class="block mr-2"
			><img
				alt="User"
				src={$user.pft}
				class="h-8 mx-auto object-cover rounded-full w-8 bg-white"
			/></span
		>
		Sign out</button
	>
{:else}
	<SocialLinks />
	<!-- <button>Flows</button> -->
	<SWIN />
{/if}
