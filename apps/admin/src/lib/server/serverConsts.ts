import { env } from '$env/dynamic/private';
import { FLOW_ABI } from './abi';
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
			scanURL: string;
			deliver: string;
		};
	};
} {
	return {
		dev: {
			'base-sepolia': {
				deliver: '0xFcAc032068C867373d0BA48aB0fa83142D557069',
				scanURL: 'https://sepolia.basescan.org'
			}
		},
		prod: {
			base: {
				deliver: '', //todo
				scanURL: 'https://basescan.org'
			}
		},
		test: {
			'base-sepolia': {
				deliver: '0xFcAc032068C867373d0BA48aB0fa83142D557069',
				scanURL: 'https://sepolia.basescan.org'
			}
		}
	};
}

function contracts() {
	return envConfig()[env.VITE_NODE_ENV][network];
}

const projectId = env.INFURA_PROJECT_ID;
const provider = new ethers.InfuraProvider(network, projectId);

export const serverWallet = new ethers.Wallet(env.OWNER_WALLET_PK!, provider);

export function flowContract() {
	console.log('####', contracts().deliver);
	console.log(serverWallet);
	return new ethers.Contract(contracts().deliver, FLOW_ABI, serverWallet);
}

export const STATUS_PUBLISHED = 1;
