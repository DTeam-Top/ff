import axios from "axios";

export const getFlowById = async (id: string) => {
  const result = await axios.get(
    `${process.env.PUBLIC_BASE_URL}api/flow/get/${id}`
  );
  return result.data;
};

export const upateTxById = async (
  id: string,
  tx: `0x${string}`,
  cast: string,
  amount: string
) => {
  console.log({ paymentTx: tx, amount: amount, cast });
  try {
    const result = await axios.post(
      `${process.env.PUBLIC_BASE_URL}api/trace/update-tx/${id}`,
      { paymentTx: tx, amount: amount, cast }
    );
    return result.data;
  } catch (e: any) {
    console.log("sdfsdf---", JSON.stringify(e.response.data));
  }
};

export const shareCastById = async (
  id: string,
  parentCast: string,
  fid: number
) => {
  const result = await axios.post(
    `${process.env.PUBLIC_BASE_URL}api/trace/share/${id}`,
    {
      parentCast,
      fid,
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
