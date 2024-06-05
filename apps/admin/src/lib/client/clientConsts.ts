import { env } from '$env/dynamic/public';

export const USER_STORE_KEY = 'user';

function scanURL() {
	return {
		dev: 'https://sepolia.basescan.org',

		prod: 'https://basescan.org',
		test: 'https://sepolia.basescan.org'
	};
}

export const WARP_BASE = 'https://warpcast.com/';

export function getBaseScanURL() {
	return scanURL()[env.PUBLIC_NODE_ENV];
}

export const WARPCAST_SETTING_URL = 'https://warpcast.com/~/settings/verified-addresses';

export const BG_COLORLIST = [
	'bg-green-200',
	'bg-blue-200',
	'bg-red-200',
	'bg-yellow-200',
	'bg-gray-200',
	'bg-orange-200'
];

export const COMMISSIOM_MAX = 12;

export const TABS = ['Avaliable', 'History'];

export const CLIENT_ID = env.PUBLIC_CLIENT_ID;
export const FRAME_BASE_URL = env.PUBLIC_FRAME_BASE_URL;
export const BASE_URL = env.PUBLIC_BASE_URL;