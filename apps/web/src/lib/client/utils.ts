import * as sha3 from 'js-sha3';
import {
	allowanceERC1155,
	allowanceERC20,
	allowanceERC721,
	approveERC1155,
	approveERC20,
	approveERC721
} from './etherService';
import { WARPCAST_URL } from './clientConsts';

export function addressPipe(address: string | `0x${string}` | undefined, start: number = 38) {
	return address ? `${address.slice(0, 6)}...${address.slice(start)}` : '';
}

export function errorPipe(message: string) {
	if (message?.indexOf('flows.name') > -1) {
		return 'Duplicate flow name';
	} else {
		return message;
	}
}

export const activePipe = (pathname: string, link: string) => {
	if (link === '/' && pathname === link) {
		return true;
	} else if (link !== '/' && pathname.indexOf(link) > -1) {
		return true;
	} else {
		return false;
	}
};

export function isValidInteger(tokenId: string) {
	return /^[1-9]\d*$/.test(tokenId);
}

export function isValidTokenId(tokenId: string) {
	return /^[0-9]\d*$/.test(tokenId);
}

export function isValidFloat(amount: string) {
	return /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/.test(amount) || /^[1-9]\d*$/.test(amount);
}

export function isValidAddress(address: string) {
	if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
		return false;
	}

	if (/^0x[0-9a-f]{40}$/.test(address) || /^0x?[0-9A-F]{40}$/.test(address)) {
		return true;
	}
	return verifyChecksum(address);
}

function verifyChecksum(address: string): boolean {
	address = address.replace('0x', '');

	const addressHash = sha3.keccak256(address.toLowerCase());

	for (let i = 0; i < 40; i++) {
		if (
			(parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
			(parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
		) {
			return false;
		}
	}

	return true;
}

export const prepareAddressData = (
	type: string,
	address: string,
	amount: string,
	tokenId: string
) => {
	let result = {};
	switch (type) {
		case 'ERC20':
			result = {
				type,
				address,
				amount
			};
			break;

		case 'ERC721':
			result = {
				type,
				address,
				tokenId
			};
			break;
		default:
			result = {
				type,
				address,
				amount,
				tokenId
			};
			break;
	}
	return result;
};

export const validateData = async (
	type: string,
	ercAddress: string,
	amount: string,
	tokenId: string,
	owner: string,
	provider: any
) => {
	if (!isValidAddress(ercAddress)) {
		return 'Please input correct address';
	}

	let alowance = false;
	switch (type) {
		case 'ERC20': {
			if (!isValidFloat(amount)) {
				return 'Please input correct amount';
			}
			alowance = await allowanceERC20(ercAddress, owner, provider, amount);
			break;
		}
		case 'ERC721': {
			if (!isValidInteger(tokenId)) {
				return 'Please input correct tokenId';
			}
			alowance = await allowanceERC721(ercAddress, tokenId, provider, owner);
			break;
		}
		default: {
			if (!isValidTokenId(tokenId)) {
				return 'Please input correct tokenId';
			}

			if (!isValidFloat(amount)) {
				return 'Please input correct amount';
			}

			alowance = await allowanceERC1155(ercAddress, tokenId, provider, amount, owner);
			break;
		}
	}

	if (!alowance) {
		return 'You have no allowance to this address';
	}

	if (type === 'ERC1155' && (!amount || !tokenId)) {
		return 'Please input correct amount and tokenId';
	}

	if (type === 'ERC721' && !tokenId) {
		return 'Please input correct tokenId';
	}

	if (type === 'ERC20' && !amount) {
		return 'Please input correct amount';
	}

	return '';
};

export const approve = async (
	type: string,
	ercAddress: string,
	amount: string,
	tokenId: string,
	owner: string,
	provider: any
) => {
	let isApproved = false;

	switch (type) {
		case 'ERC20':
			isApproved = await approveERC20(ercAddress, owner, provider, amount);
			break;
		case 'ERC721':
			isApproved = await approveERC721(ercAddress, owner, provider, tokenId);
			break;
		default:
			isApproved = await approveERC1155(ercAddress, owner, provider);
			break;
	}
	return isApproved;
};

export const statusPipe = (type: string) => {
	switch (type) {
		case 'draft':
			return 0;
		case 'published':
			return 1;
		case 'unavailable':
			return 2;
		default: //dealed
			return 3;
	}
};

export const castAddressPipe = (cast: string, usernmae: string) => {
	const castData = cast.split('_');
	const castId = castData[1].slice(0, 10);
	return `${WARPCAST_URL}${usernmae}/${castId}`;
};
