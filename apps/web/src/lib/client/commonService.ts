import axios from 'axios';
import { BASE_URL } from './clientConsts';
import { setUser } from './store';
import { setContext } from 'svelte';

export const getStaticsTotalCount = async () => {
	const result = await axios.get(`${BASE_URL}api/c/statics`);
	return result.data;
};

export const getCaster = async (item: { fid: string; signerUuid: string; user: any }) => {
	try {
		const verify = await axios.post(`${BASE_URL}api/c/verify-user`, item);
		if (verify.data && verify.data.isVerifiedUser) {
			const res = await axios.get(`${BASE_URL}api/c/user/${item.fid}`, item);
			const user = res.data;

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
			setContext('user', user);
		}
	} catch (e) {
		console.log(e);
		throw e;
	}
};
