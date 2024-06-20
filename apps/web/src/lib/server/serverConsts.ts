import { env } from '$env/dynamic/private';
import { FLOW_ABI } from './abi';
import { ethers } from 'ethers';

import pino from 'pino';

export const LOGGER = pino({ level: 'debug' });

function networkConfig() {
	return { dev: 'base-sepolia', prod: 'base', test: 'base-sepolia' };
}

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
	return envConfig()[env.BACKED_NODE_ENV][networkConfig()[env.BACKED_NODE_ENV]];
}

function getProvider() {
	return new ethers.InfuraProvider(networkConfig()[env.BACKED_NODE_ENV], env.INFURA_PROJECT_ID);
}

export function getServerWallet() {
	return new ethers.Wallet(env.OWNER_WALLET_PK!, getProvider());
}

export function flowContract() {
	return new ethers.Contract(contracts().deliver, FLOW_ABI, getServerWallet());
}

export const STATUS_PUBLISHED = 1;
