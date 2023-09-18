import { ethers, BigNumberish, Contract } from "ethers";
import * as viem from "viem";
import MulticallAbi from "../constants/MulticallABI.json";
import {
  TransactionRequest,
  generate7412CompatibleCall,
} from "../hooks/useTransact";
import Multicall from "../constants/TrustedMulticallForwarder.json";

export const readMulticall = async (
  contract: Contract,
  fn: string,
  args: Array<any>,
  provider: any,
  account: `0x${string}` | undefined,
  value?: BigNumberish | undefined,
) => {
  try {
    const data = contract.interface.encodeFunctionData(fn, args);

    const viemClient = viem.createPublicClient({
      transport: viem.custom({
        request: ({ method, params }) => (provider as any).send(method, params),
      }),
    });

    const multicallFunc = function makeMulticallCall(
      calls: TransactionRequest[],
    ): TransactionRequest {
      const ret = viem.encodeFunctionData({
        abi: Multicall.abi,
        functionName: "aggregate3Value",
        args: [
          calls.map((call) => ({
            target: call.to,
            callData: call.data,
            value: call.value || 0n,
            allowFailure: false,
          })),
        ],
      });

      let totalValue = 0n;
      for (const call of calls) {
        totalValue += call.value || 0n;
      }

      return {
        to: Multicall.address as `0x${string}`,
        data: ret,
        value: totalValue,
      };
    };

    const txn = await generate7412CompatibleCall(viemClient, multicallFunc, {
      account: account as `0x${string}`,
      to: contract.address as `0x${string}`,
      data: data as `0x${string}`,
      value: value as any,
    });

    const result = await viemClient.call({
      account: "0x4200000000000000000000000000000000000006", // simulate w/ wETH contract because it will have eth
      data: txn.data,
      to: txn.to,
      value: txn.value,
    });

    console.log([result]);

    const decodedFunctionResult = viem.decodeFunctionResult({
      abi: MulticallAbi,
      functionName: "aggregate3Value",
      data: result.data!,
    }) as any[];

    const decodeFunction = viem.decodeFunctionResult;
    const decodedFunctionResult2 = decodeFunction({
      abi: JSON.parse(
        contract.interface.format(ethers.utils.FormatTypes.json).toString(),
      ),
      args: [],
      functionName: fn,
      data: decodedFunctionResult[decodedFunctionResult.length - 1].returnData,
    });

    return decodedFunctionResult2;
  } catch (error) {
    throw error;
  }
};
