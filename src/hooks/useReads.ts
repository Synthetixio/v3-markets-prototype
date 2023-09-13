import { BigNumberish, Contract } from "ethers";
import { useCallback, useState } from "react";
import { useProvider, useAccount } from "wagmi";
import * as viem from "viem";
import MulticallAbi from "../constants/MulticallABI.json";
import { TransactionRequest, generate7412CompatibleCall } from "./useTransact";

const multiCallAddress = "0xa0266eE94Bff06D8b07e7b672489F21d2E05636e";

export const useReads = () => {
  const [isLoading, setIsLoading] = useState(false);
  const provider = useProvider();
  const account = useAccount();

  const read = useCallback(
    async (
      contract: Contract,
      fn: string,
      args: Array<any>,
      value?: BigNumberish | undefined,
    ) => {
      setIsLoading(true);
      console.log("read beging!");
      try {
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
            abi: MulticallAbi,
            functionName: "aggregate3Value",
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
            to: multiCallAddress,
            data: ret,
            value: totalValue,
          };
        };

        console.log({
          multicallFunc,
          from: account.address,
          to: contract.address,
          data,
          value,
        });

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

        console.log("HEY2", {
          txn,
        });

        const result = await viemClient.call({
          account: account.address,
          data: txn.data,
          to: txn.to,
          value: 100000n,
        });

        console.log({ result });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [account, provider],
  );

  return {
    read,
    isLoading,
  };
};
