import axios from 'axios';
import { BASE_URL, LIMIT_MAX_HOME } from './clientConsts';
import { setUser } from './store';
import { setContext } from 'svelte';
import { env } from '$env/dynamic/public';

export const getStaticsTotalCount = async () => {
	const result = await axios.get(`${BASE_URL}api/c/statistic`);
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

export const getAllTraces = async ({ pageParam = 1 }) => {
	const offset = (pageParam.pageParam - 1) * LIMIT_MAX_HOME;

	const result = await axios.get(`${BASE_URL}api/c/browse?offset=${offset}&max=${LIMIT_MAX_HOME}`);
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

export const getPreviewUrl = async (
	baseUrl: string,
	name: string,
	cover: string,
	price: number
) => {
	let previewUrl = `${baseUrl}/api/0?name=${name}&price=${price}`;
	if (cover) {
		previewUrl += `&image=${cover}`;
	}
	const res = await axios.get(previewUrl);

	const parser = new DOMParser();
	const document = parser.parseFromString(res.data, 'text/html');

	const prviewImage = document?.querySelector('meta[property="fc:frame:image"]').content;

	return prviewImage;
};

export const generateApiKey = async (item: { fid: string; signerUuid: string }) => {
	const res = await axios.post(`${BASE_URL}api/c/generate`, item);
	return res.data.apiKey;
};
