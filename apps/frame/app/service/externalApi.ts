import axios from "axios";

export const getFlowById = async (id: string) => {
  const result = await axios.get(
    `${process.env.ADMIN_BASE_URL}api/c/flows/get/${id}`
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
      `${process.env.ADMIN_BASE_URL}api/f/traces/update-tx/${id}`,
      { paymentTx: tx, amount: amount, cast },
      {
        headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
      }
    );
    console.log(result.data);
    return result.data;
  } catch (e: any) {
    console.log("sdfsdf---", JSON.stringify(e.response.data));
  }
};
