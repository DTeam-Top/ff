<script lang="ts">
	import SWIN from '$lib/components/SWIN.svelte';
	import { user, removeItem, signed } from '$lib/client/store';
	import WalletButton from '../WalletButton.svelte';
	import SocialLinks from '../SocialLinks.svelte';
	import SignoutIcon from './icons/SignoutIcon.svelte';
	import UserAvatar from '../UserAvatar.svelte';
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
		<span class="block mr-2"> <UserAvatar url={$user.pft} /></span>
		Sign out</button
	>
{:else}
	<SocialLinks />
	<!-- <button>Flows</button> -->
	<SWIN />
{/if}
