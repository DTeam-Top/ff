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
	logger.info(flow);
	const result = await axios.post(`${PUBLIC_BASE_URL}api/flow`, flow);

	console.log(result);
	setFarcaster({ id: result.data.id });
};

export const getFlows = async (creator: number) => {
	logger.info(creator);
	const result = await axios.get(`${PUBLIC_BASE_URL}api/flow/list?creator=${creator}`);
	return result.data;
};

export const deleteFlow = async (id: number) => {
	logger.info(id);
	const result = await axios.post(`${PUBLIC_BASE_URL}api/flow/delete/${id}`);
	return result.data;
};

export const getFlowById = async (id: number) => {
	logger.info(id);
	const result = await axios.get(`${PUBLIC_BASE_URL}api/flow/get/${id}`);
	return result.data;
};

export const publishFlow = async (cast: Cast) => {
	console.log(cast);
	const result = await axios.post(`${PUBLIC_BASE_URL}api/publish`, cast);
	return result.data;
};
