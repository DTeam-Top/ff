/** @jsxImportSource frog/jsx */
import { parseEther } from "ethers";
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { cors } from "hono/cors";
import {
  ERC20_ABI,
  ERC721_ABI,
  ERC721_contract_84532,
  test_CONTRACT,
  test_abi,
  text_css,
} from "./constants";
import { addressPipe } from "./utils";
import {
  createTrace,
  getFlowById,
  shareCastById,
  upateTxById,
} from "@/app/service/externalApi";
import { castIdPipe } from "@/app/service/utile";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
});

let contract: `0x${string}` = "0x";
let obj = {
  name: "",
  price: "",
  image: "",
  farcasterId: "",
  contract: "",
};
app.frame(
  "/:farcasterId",
  cors({
    origin: "*",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
  async (c) => {
    console.log(c.req.query());
    console.log(c);
    const { farcasterId } = c.req.param();
    if (Number(farcasterId) === 0) {
      const { name, price, nft, image } = c.req.query();
      contract = nft as `0x${string}`;
      obj = { name, price, image, farcasterId, contract: nft };
    } else {
      console.log("farcasterId", farcasterId);
      const flow = await getFlowById(farcasterId);
      console.log(c);
      if (flow.length > 0) {
        const { parentId } = c.req.query();
        const { frameData } = c;
        if (frameData)
          await createTrace(
            Number(farcasterId),
            castIdPipe(frameData?.castId),
            parentId,
            frameData?.fid
          );
      }
      obj = {
        name: flow[0].name,
        price: flow[0].input.price,
        image: flow[0].cover,
        farcasterId,
        contract: flow[0].input.nft,
      };
    }

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
            Name:&nbsp;&nbsp;{obj.name}
          </div>
          <div tw={`text-[30px] text-white `} style={text_css}>
            Price:&nbsp;&nbsp;{obj.price} ETH
          </div>
          <div tw={`text-[30px] text-white `} style={text_css}>
            NFT:&nbsp;&nbsp;{obj.contract}
          </div>
          {obj.image && (
            <img
              src={obj.image}
              style={{ width: "200px", height: "200px" }}
              tw={`mx-auto`}
            />
          )}
        </div>
      ),
      intents: [
        <Button.Transaction target="/mint/erc20">Mint</Button.Transaction>,
        <Button>Share to earn</Button>,
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

app.frame("/finish/:farcasterId", async (c) => {
  const { transactionId, buttonIndex, castId } = c;
  const farcasterId = c.req.param("farcasterId");
  console.log({ transactionId, buttonIndex, castId });
  if (buttonIndex === 2) {
    console.log("share", c);
    //castId: { fid: 365538, hash: '0xee3e987d8d4dc94975a39a3dec171e02832a6315' }
    await shareCastById(farcasterId, castId);
    return c.res({
      action: `/${farcasterId}`,
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
            Share successfully!
          </div>
        </div>
      ),
      intents: [<Button>Return</Button>],
    });
  } else {
    if (transactionId) {
      await upateTxById(farcasterId, transactionId);
      return c.res({
        action: `/${farcasterId}`,
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
        intents: [<Button>Return</Button>],
      });
    } else {
      return c.res({
        action: `/${farcasterId}`,
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
              Invalidate transaction hash!
            </div>
          </div>
        ),
        intents: [<Button>Return</Button>],
      });
    }
  }
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
