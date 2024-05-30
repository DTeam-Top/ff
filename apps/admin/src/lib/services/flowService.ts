import { PUBLIC_BASE_URL } from '$env/static/public';
import { LOGGER } from '$lib/db/constant';
import axios from 'axios';
import { setFarcaster } from './store';
export type Flow = {
	name: string;
	cover: string | undefined;
	input: { price: string; nft: string };
	creator: number;
	id: number | undefined;
};

export type Cast = {
	fid: string;
	signerUuid: string;
	frameUrl: string;
	content: string;
	flowId: number;
};

const logger = LOGGER.child({ from: 'flowService' });

export const insertFlow = async (flow: Flow) => {
	const result = await axios.post(`${PUBLIC_BASE_URL}api/flows`, flow);
	setFarcaster({ id: result.data.id });
};

export const getFlows = async (creator: number) => {
	const result = await axios.get(`${PUBLIC_BASE_URL}api/flows/list?creator=${creator}`);
	return result.data;
};

export const deleteFlowById = async (id: number) => {
	const result = await axios.post(`${PUBLIC_BASE_URL}api/flows/delete/${id}`);
	return result.data;
};

export const getFlow = async (id: number) => {
	const result = await axios.get(`${PUBLIC_BASE_URL}api/flows/get/${id}`);
	return result.data;
};

export const publishFlow = async (cast: Cast) => {
	const result = await axios.post(`${PUBLIC_BASE_URL}api/publish`, cast);
	return result.data;
};

export const getStaticsCount = async () => {
	const result = await axios.get(`${PUBLIC_BASE_URL}api/flows/statics`);
	return result.data;
};
