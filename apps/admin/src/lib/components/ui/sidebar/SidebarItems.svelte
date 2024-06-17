<script lang="ts">
	import { walletAddress, setWalletAddress, user, removeItem, signed } from '$lib/client/store';
	import { data } from './data';
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { activePipe, addressPipe } from '$lib/client/utils';
	import GithubIcon from '../icons/GithubIcon.svelte';
	import { GITHUB_URL } from '$lib/client/clientConsts';
	import WalletIcon from '../icons/WalletIcon.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import SWIN from '$lib/components/SWIN.svelte';
	import WalletButton from '$lib/components/WalletButton.svelte';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}

	const style = {
		title: `text-sm whitespace-pre font-bold`,
		active: `bg-primary-active-token`
	};

	const disConnectHanlder = () => {
		setWalletAddress('');
	};

	const singoutHandler = () => {
		removeItem('user', window);
		window.location.reload();
	};
</script>

<nav class="bg-transparent border border-surface-500/30 h-full text-center">
	<ul class="">
		{#each data as item}
			<li
				class={`text-center py-4 border-b border-gray-700 hover:bg-primary-hover-token ${activePipe($page.url.pathname, item.link) ? style.active : ''}`}
			>
				<a class={`items-center`} href={item.link} on:click={drawerClose}>
					<div class={`mx-auto`}>
						<svelte:component this={item.icon} />
					</div>
					<span class={`${style.title}`}>
						{item.title}
					</span>
				</a>
			</li>
		{/each}
	</ul>
	<div class="lg:hidden block">
		<ul>
			<li class={`text-center py-4 border-b border-gray-700 hover:bg-primary-hover-token `}>
				<a class="items-center font-bold" href={GITHUB_URL} target="_blank"
					><div class="mx-auto w-7">
						<svelte:component this={GithubIcon} />
					</div>
					<span class="text-sm whitespace-pre font-bold">Github</span>
				</a>
			</li>

			{#if $walletAddress}
				<li
					class={`text-center py-4 border-b border-gray-700 hover:bg-primary-hover-token `}
					on:click={disConnectHanlder}
				>
					<div class="items-center font-bold">
						<div class="mx-auto w-7">
							<svelte:component this={WalletIcon} />
						</div>
						<span class="text-sm whitespace-pre font-bold">{addressPipe($walletAddress)}</span>
					</div>
					<div
						class="border border-[#495A8C] items-center w-[100px] mx-auto py-1 rounded px-[15px] hover:variant-soft-primary cursor-pointer"
					>
						Disconnect
					</div>
				</li>
			{:else}
				<li class="mx-auto items-center">
					<WalletButton />
				</li>
			{/if}

			<li class={`text-center py-4 border-b border-gray-700 hover:bg-primary-hover-token `}>
				{#if $signed}
					<div class="items-center font-bold" on:click={singoutHandler}>
						<div class="mx-auto w-7">
							<UserAvatar url={$user.pft} />
						</div>
						<span class="text-sm whitespace-pre font-bold">Sign out</span>
					</div>
				{/if}
			</li>
		</ul>
	</div>
</nav>
