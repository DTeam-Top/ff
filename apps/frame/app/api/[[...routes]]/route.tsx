/** @jsxImportSource frog/jsx */
import { ethers, keccak256, parseEther } from "ethers";
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { cors } from "hono/cors";
import { getFlowById, upateTxById } from "@/app/service/externalApi";
import { addressPipe, castIdPipe } from "@/app/service/utile";
import { neynar } from "frog/hubs";
import { DVP_ADDRESS, test_CONTRACT, text_css } from "@/app/service/constants";
import { FLOWSDVP_ABI, test_abi } from "@/app/service/abi";
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
      const { name, price, image } = c.req.query();
      obj = {
        name,
        price,
        image,
        flowId,
        seller: "",
        addressList: [{ type: "", address: "", amount: "", tokenId: "" }],
      };
    } else {
      const flow = await getFlowById(flowId);
      if (flow) {
        obj = {
          name: flow.name,
          price: flow.input.price,
          image: flow.cover,
          flowId,
          seller: flow.seller,
          addressList: flow.input.addressList,
        };
      }
    }
    console.log(obj);
    const shareLink = `${process.env.ADMIN_BASE_URL}share/${flowId}`;
    const detailLink = `${process.env.ADMIN_BASE_URL}flows/view/${flowId}`;

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
          {obj.image && (
            <img
              src={obj.image}
              style={{ height: "100%" }}
              tw={`mx-auto mt-4`}
            />
          )}

          <div
            tw={`text-black  absolute bottom-0 right-0 text-4xl mb-2 bg-gray-100 rounded `}
            style={text_css}
          >
            Name:&nbsp;&nbsp;{obj.name}&nbsp;&nbsp;&nbsp;&nbsp;
            Price:&nbsp;&nbsp;
            {obj.price} ETH
          </div>
        </div>
      ),
      intents: [
        <Button.Transaction target={`/pay/${flowId}`}>Pay</Button.Transaction>,
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

  console.log(ERC20List);
  console.log(ERC721List);

  console.log(ERC1155List);

  const args = [
    flowId,
    commissionReceiverFid,
    from,
    to,
    [price, ERC20List, ERC721List, ERC1155List],
    sig,
  ];

  console.log("args----", args, ERC20List, ERC721List, ERC1155List);
  console.log(DVP_ADDRESS);
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

// app.transaction("/mint-old/:type", (c) => {
//   const type = c.req.param("type");
//   const { address } = c;
//   return c.contract({
//     abi: type === "erc20" ? ERC20_ABI : ERC721_ABI,
//     // @ts-ignore   using this to remove the ts error by hwh
//     chainId: "eip155:84532",
//     functionName: "mint",
//     args: type === "erc20" ? [address, 1] : [address, 2],
//     to: type === "erc20" ? contract : ERC721_contract_84532,
//     value: parseEther("0.005"),
//   });
// });

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
