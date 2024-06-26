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
	'bg-primary-300',
	'bg-secondary-300',
	'bg-success-300',
	'bg-error-300',
	'bg-warning-300',
	'bg-tertiary-300'
];

export const COMMISSIOM_MAX = 12;

export const COMISSION_TABS = ['Avaliable', 'History'];

export const FLOW_TABS = ['Draft', 'Published', 'Unavailable', 'Dealed'];

export const CLIENT_ID = env.PUBLIC_CLIENT_ID;
export const FRAME_BASE_URL = env.PUBLIC_FRAME_BASE_URL;
export const BASE_URL = env.PUBLIC_BASE_URL;
export const GITHUB_URL = 'https://github.com/DTeam-Top/ff/';

export const STATUS_PUBLISHED = 1;
export const STATUS_UNAVAILABLE = 2;
export const STATUS_DEALED = 3;

export const LIMIT_MAX = 10;
export const LIMIT_MAX_HOME = 9;

export const CREATE_TABS = ['Design', 'Preview'];

export const TOKEN_TABS = ['ERC20', 'ERC721', 'ERC1155'];

export const ERC20 = '0xf1731D81BC7be92DBD9b759a63ECAFaA569C7D0a';
export const ERC721 = '0xCd5eF176A4Af5CbEfC6F72F478726E882C49b1D7';
export const ERC1155 = '0xcaD7587a5072CB8dF1E20aeB9B7816e41A756c48';
export const BASESCAN_URL = 'https://sepolia.basescan.org/address';
export const WARPCAST_URL = 'https://warpcast.com/';

export const includeHostname = ['ff-admin.autographnft.io'];
