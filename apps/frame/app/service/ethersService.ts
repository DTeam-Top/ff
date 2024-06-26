import { ethers } from "ethers";
import { env } from "process";
import { NETWORK } from "./constants";

const projectId = env.INFURA_PROJECT_ID;
const provider = new ethers.InfuraProvider(NETWORK, projectId);

export const getSignWallet = () => {
  return new ethers.Wallet(env.OWNER_WALLET_PK!, provider);
};

export const encodePacked = (params: any) => {
  let types: any[] = [];
  let values: any[] = [];

  params.forEach((itemArray: any) => {
    types.push(itemArray[0]);
    values.push(itemArray[1]);
  });

  return ethers.solidityPacked(types, values);
};
