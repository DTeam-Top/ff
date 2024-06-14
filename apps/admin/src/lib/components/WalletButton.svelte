<script lang="ts">
	import { walletAddress, setWalletAddress, setProvider, setEthProvider } from '$lib/client/store';
	import { addressPipe } from '$lib/client/utils';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
	import { ethers } from 'ethers';
	import WalletIcon from './ui/icons/WalletIcon.svelte';
	const APP_SUPPORTED_CHAIN_IDS = [84532];

	const sdk = new CoinbaseWalletSDK({
		appName: 'Farcaster flow',
		appChainIds: APP_SUPPORTED_CHAIN_IDS
	});

	const provider = sdk.makeWeb3Provider();
	provider.on('connect', (info) => {
		console.log('info----', info);
	});
	const ethProvider = new ethers.BrowserProvider(provider);
	setProvider(provider);
	setEthProvider(ethProvider);

	const connectHanlder = async () => {
		await connectWallet();
	};

	export const connectWallet = async () => {
		const addresses: string[] = await provider.request({
			method: 'eth_requestAccounts'
		});

		console.log(addresses);
		if (addresses.length > 0) {
			setWalletAddress(addresses[0]);
		}
	};

	const disConnectHanlder = () => {
		setWalletAddress('');
	};

	$: if (!$walletAddress) {
		connectWallet();
	}
</script>

{#if !$walletAddress}
	<Button
		title="Connect"
		cssClass="flex gap-2 mr-4 border border-[#495A8C] rounded items-center h-[48px] px-[15px]"
		width="w-[130px]"
		on:click={connectHanlder}
		icon={WalletIcon}
	/>
{:else}
	<div
		class="flex gap-2 border border-[#495A8C] rounded items-center h-[48px] px-[15px] hover:variant-soft-primary"
		on:click={disConnectHanlder}
	>
		<svelte:component this={WalletIcon} />
		{addressPipe($walletAddress)}
	</div>
{/if}
