<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { delteStorage, getStorage, user, withdrawAddressKey } from '$lib/client/store';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { addressPipe } from '$lib/client/utils';
	import RadioAddress from './RadioAddress.svelte';
	import Button from './Button.svelte';
	let options = '';
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(options);
		modalStore.close();
	}

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	let selectedAddress = getStorage(withdrawAddressKey, window);

	const switchHandler = () => {
		delteStorage(withdrawAddressKey);
		selectedAddress = '';
	};
	$: if (selectedAddress) {
		options = selectedAddress;
	} else if ($user) {
		if ($user.verifiedAddresses.eth_addresses.length === 1) {
			selectedAddress = $user.verifiedAddresses.eth_addresses[0];
			options = $user.verifiedAddresses.eth_addresses[0];
		}
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>
			{selectedAddress
				? `Will withdraw to your verified address in farcaster: ${addressPipe(selectedAddress)}`
				: $modalStore[0].body ?? '(body missing)'}
		</article>
		{#if !selectedAddress}
			<form class="modal-form {cForm}">
				<label class="label">
					<span>ETH AddressList</span>
					<div class="space-y-2">
						{#each $user.verifiedAddresses.eth_addresses as ethAddress, i}
							<RadioAddress value={ethAddress} label={addressPipe(ethAddress)} bind:options />
						{/each}
					</div>
				</label>
			</form>
		{:else if $user.verifiedAddresses.eth_addresses.length > 1}
			<div
				on:click={switchHandler}
				class="underline cursor-pointer text-primary-500 hover:text-primary-100 w-[100px]"
			>
				Switch
			</div>
		{/if}
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Confirm</button>
		</footer>
	</div>
{/if}
