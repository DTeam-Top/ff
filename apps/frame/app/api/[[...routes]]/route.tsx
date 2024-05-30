/** @jsxImportSource frog/jsx */
import { parseEther } from "ethers";
import { Button, Frog, TextInput } from "frog";
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
import { getFlowById, upateTxById } from "@/app/service/externalApi";
import { castIdPipe } from "@/app/service/utile";
import { neynar } from "frog/hubs";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: neynar({ apiKey: `${process.env.PUBLIC_NEYNAR_KEY}` }),
  verify: "silent",
});

let contract: `0x${string}` = "0x";
let obj = {
  name: "",
  price: "",
  image: "",
  flowId: "",
  contract: "",
};

app.frame(
  "/:flowId",
  cors({
    origin: "*",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
  async (c) => {
    const { flowId } = c.req.param();
    if (Number(flowId) === 0) {
      const { name, price, nft, image, parentId } = c.req.query();
      contract = nft as `0x${string}`;
      obj = { name, price, image, flowId, contract: nft };
    } else {
      const flow = await getFlowById(flowId);
      console.log(c);
      if (flow.length > 0) {
        obj = {
          name: flow[0].name,
          price: flow[0].input.price,
          image: flow[0].cover,
          flowId,
          contract: flow[0].input.nft,
        };
        contract = flow[0].input.nft as `0x${string}`;
      }
    }

    return c.res({
      action: `/finish/${flowId}`,
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
            ERC20:&nbsp;&nbsp;{obj.contract}
          </div>
          {obj.image && (
            <img
              src={obj.image}
              style={{ width: "200px", height: "200px" }}
              tw={`mx-auto mt-4`}
            />
          )}
        </div>
      ),
      intents: [
        <Button.Transaction target="/mint/erc20">Mint</Button.Transaction>,
        <Button>Share To Earn</Button>,
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

app.frame("/finish/:flowId", async (c) => {
  console.log("finish", c);
  console.log(obj);
  const { transactionId, buttonIndex, frameData, verified } = c;
  if (!verified) console.log("Frame verification failed");

  const flowId = c.req.param("flowId");
  if (frameData) {
    const castId = castIdPipe(frameData?.castId);

    if (buttonIndex === 2) {
      console.log(`${process.env.PUBLIC_FRAME_URL}/${flowId}`);
      return c.res({
        action: `/${flowId}`,
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
        await upateTxById(flowId, transactionId, castId, obj.price);
        return c.res({
          action: `/${flowId}`,
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
          action: `/${flowId}`,
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
  } else {
    return c.res({
      action: `/${flowId}`,
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
            Error!
          </div>
        </div>
      ),
      intents: [<Button>Return</Button>],
    });
  }
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
