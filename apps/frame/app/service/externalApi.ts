import axios from "axios";

export const getFlowById = async (id: string) => {
  const result = await axios.get(
    `${process.env.PUBLIC_BASE_URL}api/flow/get/${id}`
  );
  return result.data;
};

export const upateTxById = async (id: string, tx: `0x${string}`) => {
  const result = await axios.post(
    `${process.env.PUBLIC_BASE_URL}api/flow/update-tx/${id}`,
    { tx }
  );
  return result.data;
};

export const shareCastById = async (
  id: string,
  parentCast: { fid: string; hash: string }
) => {
  const result = await axios.post(
    `${process.env.PUBLIC_BASE_URL}api/flow/share/${id}`,
    {
      parentCast,
    }
  );
  return result.data;
};

export const createTrace = async (
  flowId: number,
  castId: string,
  parentCast: string,
  fid: number
) => {
  const result = await axios.post(`${process.env.PUBLIC_BASE_URL}api/trace`, {
    cast: castId,
    flow: flowId,
    parentCast: parentCast,
    caster: fid,
  });
  return result.data;
};
