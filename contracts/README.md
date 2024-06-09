# Contracts

## How To Deploy

1. deploy `FlowsDvp`.
1. set the address of `FlowsDvp` in `mud.config.ts`.
1. set `PRIVATE_KEY` in `.env`, see the example below.
1. deploy the world contract with `pnpm mud deploy`.
1. set the world address to `FlowsDvp`.

## How to test

1. create `.env` with the following content:

```sh
PRIVATE_KEY=...
```

2. run `pnpm mud test`
