import axios from 'axios';
import { setFarcaster } from './store';
import { BASE_URL, LIMIT_MAX } from './clientConsts';
import { statusPipe } from './utils';
import { generateApiKey } from './commonService';
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

export const setHeaders = async (user: { fid: string; signerUuid: string }) => {
	const apiKey = await generateApiKey(user);
	axios.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
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
	const result = await axios.get(`${BASE_URL}api/c/flows/get/${id}?type=edit`);
	return result.data;
};

export const publishFlow = async (flowId: string) => {
	const result = await axios.post(`${BASE_URL}api/s/flows/publish/${flowId}`);
	return result.data;
};

export const getStatisticsCount = async (fid: number | undefined) => {
	const result = await axios.get(`${BASE_URL}api/s/flows/statistic/${fid}`);
	return result.data;
};

export const getTracesByFlowId = async (flowId: string, fid: number) => {
	const result = await axios.get(`${BASE_URL}api/s/traces/list/${flowId}?caster=${fid}`);
	return result.data;
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

export const getStatistics = async (fid: number) => {
	const result = await axios.get(`${BASE_URL}api/s/commissions/statistic/${fid}`);
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
