import { ethers, formatEther, parseEther } from 'ethers';
import { setWalletAddress } from './store';

export const ERC20_ABI = [
	'function transferEarnings(address, uint256) public',
	'function allowance(address, address) view returns (uint256)',
	'function decimals() external pure returns (uint8)',
	'function balanceOf(address account) external view returns (uint256)',
	'function approve(address, uint256) external returns (bool)'
];

export const ERC721_ABI = [
	'function isApprovedForAll(address, address) external view returns (bool)',
	'function getApproved(uint256) external view returns (address)',
	'function ownerOf(uint256 _tokenId) external view returns (address)',
	'function owner() public view returns (address)',
	'function balanceOf(address) public view returns (uint256)',
	'function approve(address, uint256) external returns (bool)',
	'function setApprovalForAll(address, bool) external'
];
export const ERC1155_ABI = [
	'function balanceOf(address account, uint256 id) external view returns (uint256)',
	'function balanceOfBatch(tuple(address)[]  memory accounts, tuple(uint256)[] memory ids) public view  returns (uint256[] memory)',
	'function isApprovedForAll(address account, address operator) external view returns (bool)',
	'function setApprovalForAll(address operator, bool approved) external'
];

const spender = '0xfcac032068c867373d0ba48ab0fa83142d557069'; //base sepolia

export async function allowanceERC20(ERC20: string, owner: string, provider: any, amount: string) {
	let balance = 0;
	try {
		console.log(provider);
		balance = await new ethers.Contract(ERC20, ERC20_ABI, provider).balanceOf(owner);
		console.log('balance--', balance, formatEther(balance), owner);
		return Number(formatEther(balance)) > Number(amount);
	} catch (e) {
		console.log(e);
		return false;
	}
}

export async function allowanceERC721(
	ERC721: string,
	tokenId: string,
	provider: any,
	spender: string
) {
	let owner = '';
	try {
		owner = await new ethers.Contract(ERC721, ERC721_ABI, provider).ownerOf(tokenId);
		console.log('owner', owner, spender, owner.toLowerCase() === spender.toLowerCase());
		return owner.toLowerCase() === spender.toLowerCase();
	} catch (e) {
		console.log(e);
		return false;
	}
}

export async function allowanceERC1155(
	ERC1155: string,
	tokenId: string,
	provider: any,
	amount: string,
	owner: string
) {
	let balance = 0;
	try {
		balance = await new ethers.Contract(ERC1155, ERC1155_ABI, provider).balanceOf(owner, tokenId);
		console.log('balance', balance, formatEther(balance));
		return Number(formatEther(balance)) > Number(amount);
	} catch (e) {
		console.log(e);
		return false;
	}
}

export async function approveERC20(ERC20: string, owner: string, provider: any, amount: string) {
	let allowance = 0;
	try {
		console.log(provider);
		allowance = await new ethers.Contract(ERC20, ERC20_ABI, provider).allowance(owner, spender);
		console.log('allowance---', allowance, formatEther(allowance), amount);
		if (Number(formatEther(allowance)) < Number(amount)) {
			const signer = await provider.getSigner();
			const erc20Contract = new ethers.Contract(ERC20, ERC20_ABI, signer);
			try {
				const tx = await erc20Contract.approve(spender, parseEther(amount), {
					gasLimit: 6000000
				});
				await tx.wait();
				return true;
			} catch (error) {
				console.error('Approve erc20 failed.', error);
				return false;
			}
		}
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export async function approveERC721(ERC721: string, owner: string, provider: any, tokenId: string) {
	let allowance = '';
	try {
		console.log(provider);
		allowance = await getERC721Approved(owner, ERC721, tokenId, spender, provider);
		console.log('allowance', allowance, spender);
		if (!allowance) {
			const signer = await provider.getSigner();
			const erc20Contract = new ethers.Contract(ERC721, ERC721_ABI, signer);
			try {
				const tx = await erc20Contract.approve(spender, tokenId, {
					gasLimit: 6000000
				});
				await tx.wait();
				return true;
			} catch (error) {
				console.error('Approve erc20 failed.', error);
				return false;
			}
		}
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

const getERC721Approved = async (
	owner: string,
	token: string,
	tokenId: string,
	dvp: string,
	provider: any
) => {
	const erc721Contract = new ethers.Contract(token, ERC721_ABI, provider);

	try {
		return (await erc721Contract.getApproved(tokenId)).toLowerCase() === dvp.toLowerCase();
	} catch (error) {
		console.error('getApproved failed, try isApprovedForAll function');
		return await erc721Contract.isApprovedForAll(owner, dvp);
	}
};

export async function approveERC1155(ERC1155: string, owner: string, provider: any) {
	let allowance = false;
	try {
		console.log(owner, spender);
		allowance = await getERC1155Approved(owner, ERC1155, spender, provider);
		console.log('allowance', allowance, spender);
		if (!allowance) {
			const signer = await provider.getSigner();
			const erc20Contract = new ethers.Contract(ERC1155, ERC1155_ABI, signer);
			try {
				const tx = await erc20Contract.setApprovalForAll(spender, true, {
					gasLimit: 6000000
				});
				await tx.wait();
				return true;
			} catch (error) {
				console.error('Approve erc20 failed.', error);
				return false;
			}
		}
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

const getERC1155Approved = async (owner: string, token: string, dvp: string, provider: any) => {
	const erc1155Contract = new ethers.Contract(token, ERC1155_ABI, provider);

	try {
		return await erc1155Contract.isApprovedForAll(owner, dvp);
	} catch (error) {
		console.log(error);
		console.error('isApprovedForAll failed');
		return false;
	}
};

export const connectWallet = async (provider: any) => {
	const addresses: string[] = await provider.request({
		method: 'eth_requestAccounts'
	});
	if (addresses.length > 0) {
		setWalletAddress(addresses[0]);
	}
};
