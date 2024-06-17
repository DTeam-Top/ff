/** @jsxImportSource frog/jsx */
import { ethers, keccak256, parseEther } from "ethers";
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { cors } from "hono/cors";
import { getFlowById, upateTxById } from "@/app/service/externalApi";
import { addressPipe, castIdPipe, statusPipe } from "@/app/service/utile";
import { neynar } from "frog/hubs";
import {
  DVP_ADDRESS,
  INFO_CSS,
  PUBLISHED,
  TEXT_CSS,
} from "@/app/service/constants";
import { FLOWSDVP_ABI } from "@/app/service/abi";
import { encodePacked, getSignWallet } from "@/app/service/ethersService";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: neynar({ apiKey: `${process.env.NEYNAR_KEY}` }),
  verify: "silent",
});

let obj = {
  name: "",
  price: "",
  image: "",
  flowId: "",
  seller: "",
  addressList: [{ type: "", address: "", amount: "", tokenId: "" }],
  status: 0,
};

let statusMassage = "";

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
      const { name, price, image } = c.req.query();
      obj = {
        name,
        price,
        image,
        flowId,
        seller: "",
        addressList: [{ type: "", address: "", amount: "", tokenId: "" }],
        status: 1,
      };
    } else {
      try {
        const flow = await getFlowById(flowId);

        if (flow) {
          console.log("flow.status--", flow.status);
          obj = {
            name: flow.name,
            price: flow.input.price,
            image: flow.cover,
            flowId,
            seller: flow.seller,
            addressList: flow.input.addressList,
            status: flow.status,
          };

          statusMassage = statusPipe(flow.status);
        }
      } catch (e: any) {
        console.log(e.response.data.message);

        return e.response?.data?.message
          ? invalidFlow(c, e.response.data.message)
          : invalidFlow(c, "Unknow error, please connect to the admin");
      }
    }
    console.log(obj);
    const shareLink = `${process.env.ADMIN_BASE_URL}share/${flowId}`;
    const detailLink = `${process.env.ADMIN_BASE_URL}flows/view/${flowId}`;

    return c.res({
      action: `/finish/${flowId}`,
      image: (
        <div style={INFO_CSS}>
          {obj.image && (
            <img src={obj.image} style={{ width: "100%" }} tw={`mx-auto`} />
          )}

          {obj.status === PUBLISHED && (
            <div
              tw={`text-black  absolute bottom-0 right-0 text-4xl mb-2 bg-gray-100 rounded `}
              style={TEXT_CSS}
            >
              Name:&nbsp;&nbsp;{obj.name}&nbsp;&nbsp;&nbsp;&nbsp;
              Price:&nbsp;&nbsp;
              {obj.price} ETH
            </div>
          )}
          {obj.status !== PUBLISHED && (
            <div
              tw={`text-black  absolute bottom-0 right-0 text-4xl mb-2 bg-red-500 rounded `}
              style={TEXT_CSS}
            >
              {statusMassage}
            </div>
          )}
        </div>
      ),
      intents:
        obj.status !== PUBLISHED
          ? []
          : [
              <Button.Transaction target={`/pay/${flowId}`}>
                Pay
              </Button.Transaction>,
              <Button.Link href={detailLink}>View Details</Button.Link>,
              <Button.Link href={shareLink}>Share To Earn</Button.Link>,
            ],
    });
  }
);

app.transaction("/pay/:flowId", async (c) => {
  const flowId = c.req.param("flowId");
  console.log(c);
  const { address, frameData } = c;
  if (!frameData) {
    return c.contract({
      abi: FLOWSDVP_ABI,
      // @ts-ignore   using this to remove the ts error by hwh
      chainId: "eip155:84532",
      functionName: "wrong",
      args: [],
      to: DVP_ADDRESS,
    });
  }
  const price = parseEther("0.005");
  const to = address;
  const from = obj.seller;
  const commissionReceiverFid = BigInt(frameData?.fid);

  const message = keccak256(
    encodePacked([
      ["string", flowId],
      ["uint256", commissionReceiverFid],
      ["address", from],
      ["address", to],
    ])
  );

  const signer = await getSignWallet();

  const sig = await signer.signMessage(ethers.getBytes(message));
  console.log("sig--", sig);
  console.log("obj---", obj);

  const ERC20List: any[] = [];
  obj.addressList
    .filter((item) => item.type === "ERC20")
    .forEach((el) => {
      ERC20List.push([el.address, BigInt(parseEther(el.amount))]);
    });

  const ERC721List: any[] = [];
  obj.addressList
    .filter((item) => item.type === "ERC721")
    .forEach((el) => {
      ERC721List.push([el.address, BigInt(el.tokenId)]);
    });

  const ERC1155List: any[] = [];
  obj.addressList
    .filter((item) => item.type === "ERC1155")
    .forEach((el) => {
      ERC1155List.push([
        el.address,
        BigInt(el.tokenId),
        BigInt(parseEther(el.amount)),
      ]);
    });

  const args = [
    flowId,
    commissionReceiverFid,
    from,
    to,
    [price, ERC20List, ERC721List, ERC1155List],
    sig,
  ];

  console.log("args----", args, ERC20List, ERC721List, ERC1155List);
  return c.contract({
    abi: FLOWSDVP_ABI,
    // @ts-ignore   using this to remove the ts error by hwh
    chainId: "eip155:84532",
    functionName: "deliver",
    args: args,
    to: DVP_ADDRESS,
    value: price,
    gas: BigInt(6000000),
  });
});

app.frame("/finish/:flowId", async (c) => {
  const { transactionId, buttonIndex, frameData, verified } = c;
  if (!verified) console.log("Frame verification failed");

  const flowId = c.req.param("flowId");
  if (frameData) {
    const castId = castIdPipe(frameData?.castId);

    if (transactionId) {
      await upateTxById(flowId, transactionId, castId, obj.price);
      return transactionSucceed(c, flowId, transactionId);
    } else {
      return infoFlow(c, flowId, "Invalidate transaction hash!");
    }
  } else {
    return infoFlow(c, flowId, "Error!");
  }
});

const transactionSucceed = (c: any, flowId: string, transactionId: string) => {
  c.res({
    action: `/${flowId}`,
    image: (
      <div style={INFO_CSS}>
        <div tw={`text-[30px] text-white  mx-auto`} style={TEXT_CSS}>
          Congratulation! Mint successfully!
        </div>
        <div tw={`text-[30px] text-white  mx-auto`} style={TEXT_CSS}>
          Transaction ID: {addressPipe(transactionId, 60)}
        </div>
      </div>
    ),
    intents: [<Button>Return</Button>],
  });
};

const invalidFlow = (c: any, message: string) => {
  return c.res({
    image: (
      <div style={INFO_CSS}>
        <div tw={`text-[30px] text-white mx-auto`} style={TEXT_CSS}>
          {message}
        </div>
      </div>
    ),
  });
};

const infoFlow = (c: any, flowId: string, message: string) => {
  return c.res({
    action: `/${flowId}`,
    image: (
      <div style={INFO_CSS}>
        <div tw={`text-[30px] text-white mx-auto`} style={TEXT_CSS}>
          {message}
        </div>
      </div>
    ),
    intents: [<Button>Return</Button>],
  });
};

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
