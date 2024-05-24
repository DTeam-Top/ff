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
	verifiedAddresses: { ethAddresses: []; solAddresses: [] };
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
	verifiedAddresses: { ethAddresses: [], solAddresses: [] }
});

const setUser = (value: User) => {
	user.update(() => value);
};

export { user, setUser };