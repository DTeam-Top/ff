import axios from 'axios';
import { writable } from 'svelte/store';
import * as sha3 from 'js-sha3';

export const signed = writable();
export const removeItem = (key: string, window: any) => {
	signed.set(false);
	window.localStorage.removeItem(key);
};

export const getItem = (key: string, window: any) => {
	const item = window.localStorage.getItem(key);
	signed.set(!!item);
	return item ? JSON.parse(item) : null;
};

export const setItem = (key: string, window: any, data: any) => {
	signed.set(true);
	window.localStorage.setItem(key, data);
};

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

export const getPreviewUrl = async (
	baseUrl: string,
	name: string,
	cover: string,
	price: number,
	addressList: any[]
) => {
	let previewUrl = `${baseUrl}/api/0?name=${name}&price=${price}&address=${JSON.stringify(addressList)})}`;
	if (cover) {
		previewUrl += `&image=${cover}`;
	}
	const res = await axios.get(previewUrl);

	const parser = new DOMParser();
	const document = parser.parseFromString(res.data, 'text/html');

	const prviewImage = document?.querySelector('meta[property="fc:frame:image"]').content;

	return prviewImage;
};

export const activePipe = (pathname: string, link: string) => {
	if (link === '/' && pathname === link) {
		return true;
	} else if (link !== '/' && pathname.indexOf(link) > -1) {
		return true;
	} else {
		return false;
	}
};
export function isValidAddress(address: string) {
	if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
		// Check if it has the basic requirements of an address
		return false;
	}

	if (/^0x[0-9a-f]{40}$/.test(address) || /^0x?[0-9A-F]{40}$/.test(address)) {
		// If it's all small caps or all all caps, return true
		return true;
	}
	return verifyChecksum(address);
}

function verifyChecksum(address: string): boolean {
	// Check each case
	address = address.replace('0x', '');

	const addressHash = sha3.keccak256(address.toLowerCase());

	for (let i = 0; i < 40; i++) {
		// The nth letter should be uppercase if the nth digit of casemap is 1
		if (
			(parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
			(parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
		) {
			return false;
		}
	}

	return true;
}

export const addressListPipe = (addressList: any[]) => {
	const data: { ERC20: string[]; ERC721: string[]; ERC1155: string[] } = {
		ERC20: [],
		ERC721: [],
		ERC1155: []
	};
	for (const address of addressList) {
		console.log(address);
		console.log(Object.entries(address)[0]);
		const [key, value] = Object.entries(address)[0];
		console.log(key, value);
		data[`${key}`].push(value);
	}
	console.log(data);
	return data;
};

export const addressDataPipe = (addressList: {
	ERC20: string[];
	ERC721: string[];
	ERC1155: string[];
}) => {
	const data: any[] = [];
	for (const address of Object.entries(addressList)) {
		console.log(address);
		const [key, value] = address;
		for (const el of value) {
			const obj = {};
			obj[`${key}`] = el;
			data.push(obj);
		}
	}
	console.log(data);
	return data;
};
