import { PUBLIC_BASE_URL } from '$env/static/public';
import axios from 'axios';
import { setUser } from './store';

export const getCaster = async (item: { fid: string; signerUuid: string }) => {
	const verify = await axios.post(`${PUBLIC_BASE_URL}api/verify-user`, item);
	if (verify.data && verify.data.isVerifiedUser) {
		const res = await axios.get(`${PUBLIC_BASE_URL}api/user/${item.fid}`, item);
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
	}
};
