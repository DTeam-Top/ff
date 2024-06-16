export const castIdPipe = (castId: { fid: number; hash: string }) => {
  return `${castId.fid}_${castId.hash}`;
};

export function addressPipe(
  address: string | `0x${string}` | undefined,
  start: number = 38
) {
  return address ? `${address.slice(0, 6)}...${address.slice(start)}` : "";
}

export function statusPipe(status: number) {
  let message = "";
  switch (status) {
    case 0:
      message = "This flow is not published";
      break;
    case 1:
      break;
    case 2:
      message = "This flow is unavailable";
      break;
    case 3:
      message = "This flow is dealed";
      break;
    default:
      break;
  }
  return message;
}
