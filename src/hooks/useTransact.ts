import { BigNumberish, Contract } from "ethers";
import { useCallback, useState } from "react";
import { useProvider, useSigner, useAccount } from "wagmi";
import { EIP7412 } from "erc7412";
import { PythAdapter } from "erc7412/dist/src/adapters/pyth";
import * as viem from "viem";

const MulticallThroughAbi = [
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

async function generate7412CompatibleCall(
  client: viem.PublicClient,
  multicallFunc: (txn: any[]) => any,
  txn: any,
) {
  const adapters = [];

  // NOTE: add other providers here as needed
  adapters.push(new PythAdapter("https://xc-testnet.pyth.network/"));

  const converter = new EIP7412(adapters, multicallFunc);

  console.log("ENABLE ERC 7412", txn);
  return await converter.enableERC7412(client, { account: txn.from, ...txn });
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
        const multicallFunc = function makeMulticallThroughCall(calls: any[]) {
          const ret = viem.encodeFunctionData({
            abi: MulticallThroughAbi,
            functionName: "multicallThrough",
            args: [
              calls.map((c) => c.to),
              calls.map((c) => c.data),
              calls.map((c) => c.value),
            ],
          });

          let totalValue = 0n;
          for (const call of calls) {
            totalValue += call.value || 0n;
          }

          return {
            account,
            to: txn.to,
            data: ret,
            value: totalValue.toString(),
          };
        };

        const txn = await generate7412CompatibleCall(
          viemClient,
          multicallFunc,
          {
            from: account.address,
            to: contract.address,
            data,
            value,
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
