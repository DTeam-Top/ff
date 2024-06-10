import axios from 'axios';
import { writable } from 'svelte/store';

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
	if (message.indexOf('flows.name') > -1) {
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
	address: string
) => {
	let previewUrl = `${baseUrl}/api/0?name=${name}&price=${price}&address=${address}`;
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
