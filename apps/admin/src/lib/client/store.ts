import { writable } from 'svelte/store';

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
