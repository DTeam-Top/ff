import HomeIcon from './icons/HomeIcon.svelte';
import StatusIcon from './icons/StatusIcon.svelte';
import ArchivesIcon from './icons/ArchivesIcon.svelte';
import BrowseIcon from '../icons/BrowseIcon.svelte';
export const data = [
	{
		title: 'Home',
		icon: HomeIcon,
		link: '/'
	},
	{
		title: 'Flows',
		icon: ArchivesIcon,
		link: '/flows'
	},
	{
		title: 'Commissions',
		icon: StatusIcon,
		link: '/commissions'
	},
	{
		title: 'Browse',
		icon: BrowseIcon,
		link: '/browse'
	}
];
