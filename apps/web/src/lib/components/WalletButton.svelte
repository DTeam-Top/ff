<script lang="ts">
	import {
		walletAddress,
		setWalletAddress,
		setProvider,
		setEthProvider,
		setStorage,
		disconnectedKey,
		getStorage
	} from '$lib/client/store';
	import { addressPipe } from '$lib/client/utils';
	import Button from '$lib/components/Button.svelte';
	import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
	import { ethers } from 'ethers';
	import WalletIcon from '$lib/components/ui/icons/WalletIcon.svelte';
	import TriangleDownIcon from '$lib/components/ui/icons/TriangleDownIcon.svelte';
	import { popup } from '@skeletonlabs/skeleton';
	const APP_SUPPORTED_CHAIN_IDS = [84532];

	const sdk = new CoinbaseWalletSDK({
		appName: 'Farcaster flow',
		appChainIds: APP_SUPPORTED_CHAIN_IDS
	});

	export const provider = sdk.makeWeb3Provider();
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
			setStorage(disconnectedKey, window, false);
		}
	};

	const disConnectHanlder = () => {
		provider.disconnect();
		setWalletAddress('');
		setStorage(disconnectedKey, window, true);
	};

	$: if (!$walletAddress) {
		if (getStorage(disconnectedKey, window) === 'false') {
			connectWallet();
		}
	}
</script>

{#if !$walletAddress}
	<Button
		title="Connect"
		cssClass="flex gap-2 mr-4 lg:border lg:border-[#495A8C] rounded items-center h-[48px] px-[15px] mx-auto"
		width="w-[130px]"
		on:click={connectHanlder}
		icon={WalletIcon}
	/>
{:else}
	<div class="relative">
		<button
			class="lg:flex gap-2 lg:border lg:border-[#495A8C] rounded items-center h-[48px] px-[15px] hover:variant-soft-primary cursor-pointer hidden"
			use:popup={{ event: 'click', target: 'menu' }}
		>
			<svelte:component this={WalletIcon} />
			{addressPipe($walletAddress)}
			<span class="lg:block hidden"> <svelte:component this={TriangleDownIcon} /></span>
		</button>

		<button
			class="flex gap-2 lg:border lg:border-[#495A8C] rounded items-center h-[48px] px-[15px] cursor-pointer lg:hidden"
		>
			<svelte:component this={WalletIcon} />
			{addressPipe($walletAddress)}
		</button>
		<div
			class="block lg:hidden border border-[#495A8C] py-2 rounded mx-4"
			on:click={disConnectHanlder}
		>
			Disconnect
		</div>
		<div class="card w-60 shadow-xl" data-popup="menu">
			<div class="space-y-4">
				<nav class="list-nav">
					<ul>
						<li on:click={disConnectHanlder} class="p-4 hover:variant-soft-primary">Disconnect2</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
{/if}
