<script lang="ts">
	import SWIN from '$lib/components/SWIN.svelte';
	import { user, removeItem, signed } from '$lib/client/store';
	import WalletButton from '$lib/components/WalletButton.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	const onSingout = () => {
		removeItem('user', window);
		window.location.reload();
	};
</script>

{#if $signed}
	<SocialLinks />
	<div class="hidden lg:block">
		<WalletButton />
	</div>
	<button
		on:click={onSingout}
		class="flex gap-2 border border-[#495A8C] rounded items-center h-[48px] px-[15px] hover:variant-soft-primary"
	>
		<span class="block mr-2"> <UserAvatar url={$user.pft} /></span>
		Sign out</button
	>
{:else}
	<SocialLinks />
	<SWIN />
{/if}
