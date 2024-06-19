import HomeIcon from './icons/HomeIcon.svelte';
import StatusIcon from './icons/StatusIcon.svelte';
import ArchivesIcon from './icons/ArchivesIcon.svelte';
import ApikeyIcon from '$lib/components/ui/sidebar/icons/ApikeyIcon.svelte';
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
		title: 'Api Keys',
		icon: ApikeyIcon,
		link: '/apikeys'
	}
];
