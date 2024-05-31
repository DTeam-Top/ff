import { PUBLIC_BASE_URL } from '$env/static/public';
import axios from 'axios';

export const getCommissionList = async (fid: number) => {
	const result = await axios.get(`${PUBLIC_BASE_URL}api/commissions/${fid}`);
	return result.data;
};

export const postWithdraw = async (address: string, fid: number) => {
	const result = await axios.post(`${PUBLIC_BASE_URL}api/commissions/withdraw`, { address, fid });
	return result.data;
};
