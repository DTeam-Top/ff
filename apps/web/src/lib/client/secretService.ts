import axios from 'axios';
import { setFarcaster } from './store';
import { BASE_URL, LIMIT_MAX, LIMIT_MAX_HOME } from './clientConsts';
import { statusPipe } from './utils';
import { env } from '$env/dynamic/public';
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

export const setHeaders = (user: { fid: string; signerUuid: string }) => {
	axios.defaults.headers.common['uu_key'] = `${user?.fid}_${user?.signerUuid}`;
};

export const insertFlow = async (flow: Flow) => {
	const result = await axios.post(`${BASE_URL}api/s/flows`, flow);
	setFarcaster({ id: result.data.id });
};

export const getFlows = async (
	creator: number,
	type: string,
	offset: number,
	max: number = LIMIT_MAX,
	hasTraced: boolean = false
) => {
	const url = `${BASE_URL}api/s/flows/list?creator=${creator}&hasTraced=${hasTraced}&offset=${offset}&max=${max}&status=${statusPipe(type)}`;
	const result = await axios.get(url);
	return result.data;
};

export const deleteFlowById = async (id: number) => {
	const result = await axios.post(`${BASE_URL}api/s/flows/delete/${id}`);
	return result.data;
};

export const getFlow = async (id: string) => {
	const result = await axios.get(`${BASE_URL}api/s/flows/get/${id}?type=edit`);
	return result.data;
};

export const publishFlow = async (flowId: string) => {
	const result = await axios.post(`${BASE_URL}api/s/flows/publish/${flowId}`);
	return result.data;
};

export const getStaticsCount = async (fid: number | undefined) => {
	const result = await axios.get(`${BASE_URL}api/s/flows/statics/${fid}`);
	return result.data;
};

export const getTracesByFlowId = async (flowId: string, fid: number) => {
	const result = await axios.get(
		`${BASE_URL}api/s/traces/list/${flowId}?caster=${fid}`,
		getHeaders()
	);
	return result.data;
};

export const getAllTraces = async ({ pageParam = 1 }) => {
	const offset = (pageParam.pageParam - 1) * LIMIT_MAX_HOME;

	const result = await axios.get(
		`${BASE_URL}api/s/traces/browse?offset=${offset}&max=${LIMIT_MAX_HOME}`,
		getHeaders()
	);
	const noNextPage =
		(pageParam.pageParam === 1 && result.data.result.length < LIMIT_MAX_HOME) ||
		(pageParam.pageParam > 1 &&
			result.data.result.length + (pageParam.pageParam - 1) * LIMIT_MAX_HOME === result.data.total);
	return {
		count: result.data.total,
		next: !noNextPage ? `${env.PUBLIC_BASE_URL}?page=${pageParam.pageParam + 1}` : null,
		results: result.data.result
	};
};

export const getCommissionList = async (fid: number, offset: number, max: number) => {
	const result = await axios.get(`${BASE_URL}api/s/commissions/${fid}?offset=${offset}&max=${max}`);
	return result.data;
};

export const getHistoryList = async (fid: number, offset: number, max: number) => {
	const result = await axios.get(
		`${BASE_URL}api/s/commissions/history/${fid}?offset=${offset}&max=${max}`
	);
	return result.data;
};

export const postWithdraw = async (address: string, fid: number) => {
	const result = await axios.post(`${BASE_URL}api/s/commissions/withdraw`, {
		address,
		fid
	});
	return result.data;
};

export const insertApikey = async (apiKey: { fid: number }) => {
	const result = await axios.post(`${BASE_URL}api/s/apikeys`, apiKey);
	return result.data;
};

export const getApikeyList = async (fid: number) => {
	const result = await axios.get(`${BASE_URL}api/s/apikeys/list/${fid}`);
	return result.data;
};

export const changeApikey = async (fid: number, disabled: boolean) => {
	const result = await axios.post(`${BASE_URL}api/s/apikeys/update/${fid}`, { disabled });
	return result.data;
};
