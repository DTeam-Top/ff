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

app.frame("/:name", (c) => {
  console.log("frame", c.req.param(), c.req.method, c.req.query());

  const { name } = c.req.param();

  const { price, nft, image } = c.req.query();

  console.log("frame", name, price, nft, image);

  //const { price, nft, image } = c.req.valid("json");
  const image1 =
    "https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png";

  //http://localhost:3000/api/test?price=0.0005&nft=0x0000&image=234
  const { buttonValue, inputText, status } = c;
  console.log(inputText);
  return c.res({
    action: "/finish/0",
    image: (
      <div style={root_css}>
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
          src={image1}
          style={{ width: "200px", height: "200px" }}
          tw={`mx-auto`}
        />
      </div>
    ),
    intents: [
      //   <TextInput placeholder="Value (ETH)" />,
      <Button.Transaction target="/mint/erc20">Mint ERC20</Button.Transaction>,
      <Button.Transaction target="/mint/erc721">
        Mint ERC721
      </Button.Transaction>,
      <Button.Transaction target="/buy/0.0005">Test</Button.Transaction>,
    ],
  });
});

app.transaction("/mint/:type", (c) => {
  const type = c.req.param("type");
  const { address } = c;
  console.log("$$$$$ mint", type, c);
  return c.contract({
    abi: type === "erc20" ? ERC20_ABI : ERC721_ABI,
    // @ts-ignore   using this to remove the ts error by hwh
    chainId: "eip155:84532",
    functionName: "mint",
    args: type === "erc20" ? [address, 1] : [address, 2],
    to: type === "erc20" ? ERC20_contract_84532 : ERC721_contract_84532,
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
  console.log("farcasterId", farcasterId);
  return c.res({
    image: (
      <div style={root_css}>
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
