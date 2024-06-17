import axios from 'axios';
import { setFarcaster } from './store';
import { BASE_URL, LIMIT_MAX, LIMIT_MAX_HOME } from './clientConsts';
import { statusPipe } from './utils';
export type Flow = {
	name: string;
	cover?: string;
	input: any;
	creator: number;
	id?: string;
	seller: string;
};

export type Cast = {
	fid: string;
	signerUuid: string;
	frameUrl: string;
	content: string;
	flowId: number;
};

export const insertFlow = async (flow: Flow) => {
	const result = await axios.post(`${BASE_URL}api/flows`, flow);
	setFarcaster({ id: result.data.id });
};

export const getFlows = async (
	creator: number,
	type: string,
	offset: number,
	max: number = LIMIT_MAX,
	hasTraced: boolean = false
) => {
	const url = `${BASE_URL}api/flows/list?creator=${creator}&hasTraced=${hasTraced}&offset=${offset}&max=${max}&status=${statusPipe(type)}`;
	const result = await axios.get(url);
	return result.data;
};

export const deleteFlowById = async (id: number) => {
	const result = await axios.post(`${BASE_URL}api/flows/delete/${id}`);
	return result.data;
};

export const getFlow = async (id: string) => {
	const result = await axios.get(`${BASE_URL}api/flows/get/${id}?type=edit`);
	return result.data;
};

export const publishFlow = async (flowId: string) => {
	const result = await axios.post(`${BASE_URL}api/flows/publish/${flowId}`);
	return result.data;
};

export const getStaticsCount = async (fid: number | undefined) => {
	const result = await axios.get(`${BASE_URL}api/flows/statics/${fid}`);
	return result.data;
};
export const getTracesByFlowId = async (flowId: string, fid: number) => {
	const result = await axios.get(`${BASE_URL}api/traces/list/${flowId}?caster=${fid}`);
	return result.data;
};

export const getAllTraces = async ({ pageParam = 1 }) => {
	console.log(pageParam.pageParam);
	const offset = (pageParam.pageParam - 1) * LIMIT_MAX_HOME;

	const result = await axios.get(
		`${BASE_URL}api/traces/browse?offset=${offset}&max=${LIMIT_MAX_HOME}`
	);
	const noNextPage =
		(pageParam.pageParam === 1 && result.data.result.length < LIMIT_MAX_HOME) ||
		(pageParam.pageParam > 1 &&
			result.data.result.length + (pageParam.pageParam - 1) * LIMIT_MAX_HOME === result.data.total);
	return {
		count: result.data.total,
		next: !noNextPage ? `${import.meta.env.VITE_BASE_URL}?page=${pageParam.pageParam + 1}` : null,
		results: result.data.result
	};
};
