import { writable } from 'svelte/store';

const sidebarOpen = writable(false);

const openSidebar = () => {
	sidebarOpen.update(() => true);
};

const closeSidebar = () => {
	sidebarOpen.update(() => false);
};

export { sidebarOpen, openSidebar, closeSidebar };

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
	id: number;
};
const farcaster = writable({
	id: 0
});

const setFarcaster = (value: Farcaster) => {
	farcaster.update(() => value);
};

export { farcaster, setFarcaster };
