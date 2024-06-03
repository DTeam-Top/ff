import {
	PUBLIC_INFURA_PROJECT_ID,
	PUBLIC_NODE_ENV,
	PUBLIC_OWNER_WALLET_PK
} from '$env/static/public';
import { ERC20_ABI } from './abi';
import { ethers } from 'ethers';

export const USER_STORE_KEY = 'user';

const network = 'base-sepolia';

const projectId = PUBLIC_INFURA_PROJECT_ID;
const provider = new ethers.InfuraProvider(network, projectId);
export const owner = new ethers.Wallet(PUBLIC_OWNER_WALLET_PK, provider);

export const commissionList = [
	{
		name: 'frame1',
		cover:
			'https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png',

		hash: '0x23443333',
		ts: 1715262769,
		commission: '0.0001 ETH'
	},

	{
		name: 'frame2',
		cover:
			'https://i.seadn.io/gcs/files/b268f5141e6986aaf4f17c9ad42c4410.png?auto=format&dpr=1&w=1000',
		hash: '0x23443333',
		ts: 1717292769,
		commission: '0.0002 ETH'
	},

	{
		name: 'frame3',
		cover:
			'https://i.seadn.io/gcs/files/946fe689776ce7ae8ca40c3778d2f4e4.png?auto=format&dpr=1&w=1000',
		hash: '0x23443333',
		ts: 1719268769,
		commission: '0.0003 ETH'
	}
];

export const WARP_BASE = 'https://warpcast.com/';

export function envConfig() {
	return {
		dev: {
			'base-sepolia': {
				withdraw: '0x2F6F12b68165aBb483484927919D0d3fE450462E',
				scanURL: 'https://sepolia.basescan.org'
			}
		},
		prod: {
			base: {
				withdraw: '', //todo
				scanURL: 'https://basescan.org'
			}
		},
		test: {
			'base-sepolia': {
				withdraw: '0x2F6F12b68165aBb483484927919D0d3fE450462E',
				scanURL: 'https://sepolia.basescan.org'
			}
		}
	};
}

function contracts() {
	return envConfig()[PUBLIC_NODE_ENV][network];
}

export function getBaseScanURL() {
	return envConfig()[PUBLIC_NODE_ENV][network].scanURL;
}
export function withdrawContract() {
	console.log(contracts().withdraw);
	return new ethers.Contract(contracts().withdraw, ERC20_ABI, owner);
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

export const COMMISSIOM_MAX = 2;
