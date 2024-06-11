# Contracts

All contracts are deployed on base and base sepolia

## Env

An example `.env` is below:

```env
PRIVATE_KEY=...
SIGNER=...
ETHERSCAN_API_KEY=...
```

## How To Deploy

- `source .env`
- deploy & verify `FlowsDvp`.

```sh
forge script --chain 84532 script/DeployDVP.s.sol:DeployDVP --rpc-url https://sepolia.base.org --broadcast --verify -vvvv
```

- set the address of `FlowsDvp` in `mud.config.ts`.
- deploy the world contract.

```sh
pnpm mud deploy --rpc https://sepolia.base.org
```

- verify the world contract.

```sh
pnpm mud verify --worldAddress $world_address --rpc https://sepolia.base.org
```

- set the world address to `FlowsDvp`.

## How to test

run `pnpm mud test`
