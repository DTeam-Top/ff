import { PUBLIC_NEYNAR_KEY, PUBLIC_NEYNAR_URL } from '$env/static/public';
import axios from 'axios';
const HEADERS = { accept: 'application/json', api_key: PUBLIC_NEYNAR_KEY };

export const lookupSigner = async (signerUuid: string) => {
	const signer = await axios.get(`${PUBLIC_NEYNAR_URL}signer?signer_uuid=${signerUuid}`, {
		headers: HEADERS
	});
	return signer.data;
};

export const lookupUserByFid = async (fid: number) => {
	const user = await axios.get(`${PUBLIC_NEYNAR_URL}user/bulk?fids=${fid}`, {
		headers: HEADERS
	});
	return user.data.users.length > 0 ? user.data.users[0] : null;
};

export const createCast = async (uuid: string, text: string, frameUrl: string) => {
	const cast = await axios.post(
		`${PUBLIC_NEYNAR_URL}cast`,
		{
			signer_uuid: uuid,
			text: text,
			embeds: [
				{
					url: frameUrl
				}
			]
		},
		{
			headers: HEADERS
		}
	);
	console.log(cast.data);
	return cast.data;
};
