/** @jsxImportSource frog/jsx */

import { zValidator } from "@hono/zod-validator";
import { parseEther } from "ethers";
import { Interface } from "ethers/abi";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { cors } from "hono/cors";
import {
  ERC20_ABI,
  ERC20_contract_84532,
  ERC721_ABI,
  ERC721_contract_84532,
  root_css,
  test_CONTRACT,
  test_abi,
  text_css,
} from "./constants";
import { addressPipe } from "./utils";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
});

let contract: `0x${string}` = "0x";
app.frame(
  "/:facasterId",
  cors({
    origin: "*",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
  (c) => {
    const { facasterId } = c.req.param();

    //using facasterId to search data

    const { name, price, nft, image } = c.req.query();

    contract = nft as `0x${string}`;

    return c.res({
      action: "/finish/0",
      image: (
        <div
          style={{
            alignItems: "flex-start",
            background: "black",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div tw={`text-[30px] text-white `} style={text_css}>
            Name:&nbsp;&nbsp;{name}
          </div>
          <div tw={`text-[30px] text-white `} style={text_css}>
            Price:&nbsp;&nbsp;{price} ETH
          </div>
          <div tw={`text-[30px] text-white `} style={text_css}>
            NFT:&nbsp;&nbsp;{nft}
          </div>
          <img
            src={image}
            style={{ width: "200px", height: "200px" }}
            tw={`mx-auto`}
          />
        </div>
      ),
      intents: [
        //   <TextInput placeholder="Value (ETH)" />,
        <Button.Transaction target="/mint/erc20">
          Mint ERC20
        </Button.Transaction>,
        // <Button.Transaction target="/mint/erc721">
        //   Mint ERC721
        // </Button.Transaction>,
        // <Button.Transaction target="/buy/0.0005">Test</Button.Transaction>,
      ],
    });
  }
);

app.transaction("/mint/:type", (c) => {
  const type = c.req.param("type");
  const { address } = c;
  return c.contract({
    abi: type === "erc20" ? ERC20_ABI : ERC721_ABI,
    // @ts-ignore   using this to remove the ts error by hwh
    chainId: "eip155:84532",
    functionName: "mint",
    args: type === "erc20" ? [address, 1] : [address, 2],
    to: type === "erc20" ? contract : ERC721_contract_84532,
    value: parseEther("0.005"),
  });
});

app.transaction("/buy/:price", async (c) => {
  const price = c.req.param("price");
  return c.contract({
    abi: test_abi,
    // @ts-ignore   using this to remove the ts error by hwh
    chainId: "eip155:84532",
    functionName: "buyHat",
    args: [c.frameData?.fid],
    to: test_CONTRACT,
    value: parseEther(`${price}`),
  });
});

app.frame("/finish/:farcasterId", (c) => {
  const { transactionId } = c;
  const farcasterId = c.req.param("farcasterId");
  return c.res({
    image: (
      <div
        style={{
          alignItems: "flex-start",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div tw={`text-[30px] text-white `} style={text_css}>
          Congratulation! Mint successfully!
        </div>
        <div tw={`text-[30px] text-white `} style={text_css}>
          Transaction ID: {addressPipe(transactionId, 60)}
        </div>
      </div>
    ),
    intents: [<Button.Reset>Return</Button.Reset>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
