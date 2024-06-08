## How to test

For foundry tests: `pnpm test`.

For hardhat tests:

1. `pnpm hardhat node`
1. `pnpm mud dev-contracts --rpc http://127.0.0.1:8545`, the `rpc` is the rpc endpoint started with the last step.
1. set `worldAddress` in hardhat tests code to the output world address.
1. `pnpm run test:hh --network localhost`
