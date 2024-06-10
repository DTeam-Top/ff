import axios from 'axios';
import { setFarcaster } from './store';
import { BASE_URL, LIMIT_MAX } from './clientConsts';
export type Flow = {
	name: string;
	cover?: string;
	input: any;
	creator: number;
	id?: string;
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
	let url = `${BASE_URL}api/flows/list?creator=${creator}&hasTraced=${hasTraced}&offset=${offset}&max=${max}`;
	switch (type) {
		case 'draft':
			url += '&status=0';
			break;
		case 'published':
			url += '&status=1';
			break;
		default:
			url += '&status=2';
			break;
	}
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
