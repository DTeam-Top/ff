import { env } from '$env/dynamic/private';
import { ERC20_ABI } from './abi';
import { ethers } from 'ethers';

import pino from 'pino';

export const LOGGER = pino({ level: 'debug' });

const network = 'base-sepolia';

function envConfig(): {
	[key: string]: {
		[key: string]: {
			withdraw: string;
			scanURL: string;
		};
	};
} {
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
	return envConfig()[env.NODE_ENV][network];
}

export function withdrawContract() {
	const projectId = env.INFURA_PROJECT_ID;
	const provider = new ethers.InfuraProvider(network, projectId);
	const owner = new ethers.Wallet(env.OWNER_WALLET_PK!, provider);

	return new ethers.Contract(contracts().withdraw, ERC20_ABI, owner);
}

export const STATUS_PUBLISHED = 1;
