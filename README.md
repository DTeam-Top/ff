# Farcaster Flow

## Introduction

Farcaster Flow is a token distribution solution
powered by Farcaster.

The whole repo is a mono repo:

- packages
  - dbdomain, db schema
- apps
  - web, the flow site
  - frame, the flow frame
  - cron, the cron jobs watching the blockchain
  - bot, the webhook
- contracts, the dvp contracts supporting the token distribution

## Architecture

![ff arch](./assets/arch.png)

## Basic UI Flow

![ff ui flow](./assets/ui-flow.png)

## Run

```sh
cp .env.example .env
docker-compose up -d --build
```
