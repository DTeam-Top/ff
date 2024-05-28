export const castIdPipe = (castId: { fid: number; hash: string }) => {
  return `${castId.fid}_${castId.hash}`;
};
