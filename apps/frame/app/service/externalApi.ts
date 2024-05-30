import axios from "axios";

export const getFlowById = async (id: string) => {
  const result = await axios.get(
    `${process.env.PUBLIC_BASE_URL}api/flows/get/${id}`
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
      `${process.env.PUBLIC_BASE_URL}api/traces/update-tx/${id}`,
      { paymentTx: tx, amount: amount, cast }
    );
    return result.data;
  } catch (e: any) {
    console.log("sdfsdf---", JSON.stringify(e.response.data));
  }
};
