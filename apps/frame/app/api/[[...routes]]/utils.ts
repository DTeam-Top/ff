export function addressPipe(
  address: string | `0x${string}` | undefined,
  start: number = 38
) {
  return address ? `${address.slice(0, 6)}...${address.slice(start)}` : "";
}
