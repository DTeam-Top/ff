import { env } from '$env/dynamic/private';
import { ERC20_ABI, FLOW_ABI } from './abi';
import { ethers } from 'ethers';

import pino from 'pino';

export const LOGGER = pino({ level: 'debug' });

function networkConfig() {
	return { dev: 'base-sepolia', prod: 'base', test: 'base-sepolia' };
}

const network = networkConfig()[env.VITE_NODE_ENV];

function envConfig(): {
	[key: string]: {
		[key: string]: {
			withdraw: string;
			scanURL: string;
			deliver: string;
		};
	};
} {
	return {
		dev: {
			'base-sepolia': {
				withdraw: '0x2F6F12b68165aBb483484927919D0d3fE450462E',
				deliver: '0xFcAc032068C867373d0BA48aB0fa83142D557069',
				scanURL: 'https://sepolia.basescan.org'
			}
		},
		prod: {
			base: {
				withdraw: '', //todo
				deliver: '',
				scanURL: 'https://basescan.org'
			}
		},
		test: {
			'base-sepolia': {
				withdraw: '0x2F6F12b68165aBb483484927919D0d3fE450462E',
				deliver: '0xFcAc032068C867373d0BA48aB0fa83142D557069',
				scanURL: 'https://sepolia.basescan.org'
			}
		}
	};
}

function contracts() {
	console.log(env.VITE_NODE_ENV);
	console.log(envConfig()[env.VITE_NODE_ENV][network]);
	return envConfig()[env.VITE_NODE_ENV][network];
}

const projectId = env.INFURA_PROJECT_ID;
const provider = new ethers.InfuraProvider(network, projectId);

export const getServerWallet = () => {
	return new ethers.Wallet(env.OWNER_WALLET_PK!, provider);
};
const ownerWallet = getServerWallet();

export function withdrawContract() {
	return new ethers.Contract(contracts().withdraw, ERC20_ABI, ownerWallet);
}

export function deliverContract() {
	console.log('####', contracts());
	return new ethers.Contract(contracts().deliver, FLOW_ABI, ownerWallet);
}

export const STATUS_PUBLISHED = 1;
