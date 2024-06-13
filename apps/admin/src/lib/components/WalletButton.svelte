<script lang="ts">
	import { walletAddress, setWalletAddress, setProvider, setEthProvider } from '$lib/client/store';
	import { addressPipe } from '$lib/client/utils';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
	import { ethers } from 'ethers';
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

	onMount(() => {});

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
		cssClass="text-primary-500 cursor-pointer bg-primary-800 text-white w-40"
		width="w-[100px]"
		on:click={connectHanlder}
	/>
{:else}
	<div
		class="border border-primary-800 p-2 rounded-lg hover:variant-soft-primary"
		on:click={disConnectHanlder}
	>
		{addressPipe($walletAddress)}
	</div>
{/if}
