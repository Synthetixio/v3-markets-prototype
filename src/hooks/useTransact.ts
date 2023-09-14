import { BigNumberish, Contract } from "ethers";
import { useCallback, useState } from "react";
import { useProvider, useSigner, useAccount } from "wagmi";
import { EIP7412 } from "erc7412/dist/src/index";
import { PythAdapter } from "erc7412/dist/src/adapters/pyth";
import * as viem from "viem";

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
  return await converter.enableERC7412(client, txn);
}

export const useTransact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const provider = useProvider();
  const { data: signer } = useSigner();
  const account = useAccount();

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
          const ret = viem.encodeFunctionData({
            abi: MulticallThroughAbi,
            functionName: "multicallThrough",
            args: [
              calls.map((c) => c.to),
              calls.map((c) => c.data),
              calls.map((c) => c.value || 0n),
            ],
          });

          let totalValue = 0n;
          for (const call of calls) {
            totalValue += call.value || 0n;
          }

          return {
            account: account.address,
            to: contract.address as `0x${string}`,
            data: ret,
            value: totalValue,
          };
        };

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
