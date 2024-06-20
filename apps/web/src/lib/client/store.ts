import type { ProviderInterface } from '@coinbase/wallet-sdk';
import { setContext } from 'svelte';
import { writable } from 'svelte/store';

export const signed = writable();

export const removeItem = (key: string, window: any) => {
	signed.set(false);
	window.localStorage.removeItem(key);
};

export const getItem = (key: string, window: any) => {
	const item = window.localStorage.getItem(key);
	signed.set(!!item);
	return item ? JSON.parse(item) : null;
};

export const setItem = (key: string, window: any, data: any) => {
	signed.set(true);
	window.localStorage.setItem(key, data);
};

type User = {
	fid: number;
	pft: string;
	username: string;
	displayName: string;
	custodyAddress: string;
	followingCount: number;
	followerCount: number;
	profile: { bio: { text: string } };
	verifications: [];
	verifiedAddresses: { eth_addresses: []; sol_addresses: [] };
	signerUuid: string;
};
const user = writable({
	fid: 0,
	pft: '',
	username: '',
	displayName: '',
	custodyAddress: '',
	followingCount: 0,
	followerCount: 0,
	profile: { bio: { text: '' } },
	verifications: [],
	verifiedAddresses: { eth_addresses: [], sol_addresses: [] },
	signerUuid: ''
});

const setUser = (value: User) => {
	user.update(() => value);
};

export { user, setUser };

type Farcaster = {
	id: string;
};
const farcaster = writable({
	id: '0'
});

const setFarcaster = (value: Farcaster) => {
	farcaster.update(() => value);
};

export { farcaster, setFarcaster };

const walletAddress = writable('');

const setWalletAddress = (value: string) => {
	walletAddress.update(() => value);
};

export { walletAddress, setWalletAddress };

export const disconnectedKey = 'DISCONNECTED';

export const withdrawAddressKey = 'WITHDRAW_ADDRESS';

export const removeStorage = (key: string, window: any) => {
	window.localStorage.removeItem(key);
};

export const getStorage = (key: string, window: any) => {
	const item = window.localStorage.getItem(key);
	return item ? item : null;
};

export const setStorage = (key: string, window: any, data: any) => {
	window.localStorage.setItem(key, data);
};

export const delteStorage = (key: string) => {
	window.localStorage.removeItem(key);
};

const provider = writable();

const setProvider = (value: ProviderInterface) => {
	provider.update(() => value);
};

export { provider, setProvider };

const ethProvider = writable();

const setEthProvider = (value: any) => {
	ethProvider.update(() => value);
};

export { ethProvider, setEthProvider };
