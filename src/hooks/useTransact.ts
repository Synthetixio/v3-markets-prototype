import { BigNumberish, Contract } from "ethers";
import { useCallback, useState } from "react";
import { useProvider, useSigner, useAccount } from "wagmi";
import { EIP7412, Mati } from "erc7412";
import { PythAdapter } from "erc7412/dist/src/adapters/pyth";
import * as viem from "viem";
import Multicall from "../constants/TrustedMulticallForwarder.json";
// import PythERC7412Node from "../constants/PythERC7412Node.json";

export type TransactionRequest = {
  to?: `0x${string}` | undefined;
  data?: `0x${string}` | undefined;
  value?: bigint | undefined;
  account?: `0x${string}` | undefined;
};

export const MulticallThroughAbi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "to",
        type: "address[]",
      },
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "multicallThrough",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

export async function generate7412CompatibleCall(
  client: viem.PublicClient,
  multicallFunc: (txs: TransactionRequest[]) => TransactionRequest,
  txn: TransactionRequest,
) {
  const adapters = [];

  // NOTE: add other providers here as needed
  adapters.push(new PythAdapter("https://xc-testnet.pyth.network/"));

  const converter = new EIP7412(adapters, multicallFunc);

  console.log(txn);
  return await converter.enableERC7412(client as any, txn);
}

export const useTransact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const provider = useProvider();
  const { data: signer } = useSigner();
  const account = useAccount();

  // useEffect(() => {
  // const err = viem.decodeErrorResult({
  //   abi: PythERC7412Node.abi,
  //   data: "0xcf2cabdf0000000000000000000000009172995177a9a10fe1b7df76e2a3266c0cfc71c7000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001ca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
  // });
  // const err = viem.decodeFunctionResult({
  //   abi: PythERC7412Node.abi,
  //   functionName: "process",
  //   data: "0x5059544800000000000000000000000000000000000000000000000000000000",
  // });

  // PythERC7412Node.abi,
  // [],
  // "process",

  // "0x5059544800000000000000000000000000000000000000000000000000000000",

  // console.log({
  //   err,
  // });
  // }, []);

  const transact = useCallback(
    async (
      contract: Contract,
      fn: string,
      args: Array<any>,
      value?: BigNumberish | undefined,
    ) => {
      setIsLoading(true);
      try {
        // const feeData = await provider.getFeeData();
        const data = contract.interface.encodeFunctionData(fn, args);

        const viemClient = viem.createPublicClient({
          transport: viem.custom({
            request: ({ method, params }) =>
              (provider as any).send(method, params),
          }),
        });

        const multicallFunc = function makeMulticallThroughCall(
          calls: TransactionRequest[],
        ): TransactionRequest {
          console.log("inside makeMulticallThroughCall2");
          const multicallData = viem.encodeFunctionData({
            abi: Multicall.abi,
            functionName: "aggregate3Value",
            args: [
              calls.map((c) => ({
                target: c.to,
                allowFailure: false,
                value: c.value || 0n,
                callData: c.data,
              })),
            ],
          });

          let totalValue = 0n;
          for (const call of calls) {
            totalValue += call.value || 0n;
          }

          console.log({ totalValue: totalValue.toString() });

          return {
            account: account.address,
            to: Multicall.address as `0x${string}`,
            data: multicallData,
            value: totalValue,
          };
        };
        console.log("before generate7412CompatibleCall:");

        const txn = await generate7412CompatibleCall(
          viemClient,
          multicallFunc,
          {
            account: account.address,
            to: contract.address as `0x${string}`,
            data: data as `0x${string}`,
            value: value as bigint,
          },
        );

        console.log("after generate7412CompatibleCall");
        const gas = await signer?.estimateGas({
          to: txn.to,
          data: txn.data,
          value: txn.value,
        });
        const gasLimit = (Number(gas) * 1.2).toFixed(0);

        const tx = await signer?.sendTransaction({
          to: txn.to,
          data: txn.data,
          value: txn.value,
          gasLimit,
          /*
          maxFeePerGas: feeData.maxFeePerGas || undefined,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || undefined,
          type: 2,
          */
        });

        await tx?.wait();
        setIsLoading(false);
      } catch (error) {
        console.log("error in useTransact!", error);
        setIsLoading(false);
        throw error;
      }
    },
    [account, provider, signer],
  );

  return {
    transact,
    isLoading,
  };
};
