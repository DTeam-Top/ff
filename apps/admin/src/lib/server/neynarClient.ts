import { env } from '$env/dynamic/private';
import axios from 'axios';

const HEADERS = { accept: 'application/json', api_key: env.NEYNAR_KEY };

export const lookupSigner = async (signerUuid: string) => {
	try {
		const signer = await axios.get(`${env.NEYNAR_URL}signer?signer_uuid=${signerUuid}`, {
			headers: HEADERS
		});
		return signer.data;
	} catch (e: any) {
		await lookupSigner(signerUuid);
	}
};

export const lookupUserByFid = async (fid: number) => {
	const user = await axios.get(`${env.NEYNAR_URL}user/bulk?fids=${fid}`, {
		headers: HEADERS
	});
	return user.data.users.length > 0 ? user.data.users[0] : null;
};

export const createCast = async (uuid: string, text: string, frameUrl: string) => {
	const cast = await axios.post(
		`${env.NEYNAR_URL}cast`,
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
	return cast.data;
};
