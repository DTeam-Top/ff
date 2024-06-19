import axios from 'axios';
import { BASE_URL } from './clientConsts';
export const insertApikey = async (apiKey: { fid: number }) => {
	const result = await axios.post(`${BASE_URL}api/apikeys`, apiKey);
	return result.data;
};

export const getApikeyList = async (fid: number) => {
	const result = await axios.get(`${BASE_URL}api/apikeys/list/${fid}`);
	return result.data;
};

export const changeApikey = async (fid: number, disabled: boolean) => {
	const result = await axios.post(`${BASE_URL}api/apikeys/update/${fid}`, { disabled });
	return result.data;
};
