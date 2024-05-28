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
	if (message.indexOf('flows.name')) {
		return 'Duplicate flow name';
	} else {
		return message;
	}
}
