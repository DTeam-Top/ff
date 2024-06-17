import axios from 'axios';
import { BASE_URL } from './clientConsts';

export const getCommissionList = async (fid: number, offset: number, max: number) => {
	const result = await axios.get(`${BASE_URL}api/commissions/${fid}?offset=${offset}&max=${max}`);
	return result.data;
};

export const getHistoryList = async (fid: number, offset: number, max: number) => {
	const result = await axios.get(
		`${BASE_URL}api/commissions/history/${fid}?offset=${offset}&max=${max}`
	);
	return result.data;
};

export const postWithdraw = async (address: string, fid: number) => {
	const result = await axios.post(`${BASE_URL}api/commissions/withdraw`, {
		address,
		fid
	});
	return result.data;
};
