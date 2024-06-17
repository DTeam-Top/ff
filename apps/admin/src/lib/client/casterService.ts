import axios from 'axios';
import { setUser } from './store';

const HEADERS = { accept: 'application/json', api_key: import.meta.env.VITE_NEYNAR_KEY };

export const getCaster = async (item: { fid: string; signerUuid: string }) => {
	const verify = await lookupSigner(item.signerUuid);
	if (verify && verify.fid.toString() === item.fid) {
		const res = await lookupUserByFid(Number(item.fid));
		console.log('res---', res);
		const user = res;

		setUser({
			fid: user.fid,
			pft: user.pfp_url,
			username: user.username,
			displayName: user.display_name,
			custodyAddress: user.custody_address,
			followingCount: user.following_count,
			followerCount: user.follower_count,
			profile: user.profile,
			verifications: user.verifications,
			verifiedAddresses: user.verified_addresses,
			signerUuid: item.signerUuid
		});
	}
};

export const lookupSigner = async (signerUuid: string) => {
	try {
		const signer = await axios.get(
			`https://api.neynar.com/v2/farcaster/signer?signer_uuid=${signerUuid}`,
			{
				headers: HEADERS
			}
		);

		return signer.data;
	} catch (e: any) {
		console.log(e);
		throw e;
		//await lookupSigner(signerUuid);
	}
};

export const lookupUserByFid = async (fid: number) => {
	const user = await axios.get(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
		headers: HEADERS
	});
	return user.data.users.length > 0 ? user.data.users[0] : null;
};
