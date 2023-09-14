import { ethers, BigNumberish, Contract } from "ethers";
import * as viem from "viem";
import MulticallAbi from "../constants/MulticallABI.json";
import {
  TransactionRequest,
  generate7412CompatibleCall,
} from "../hooks/useTransact";

const multiCallAddress = "0xa0266eE94Bff06D8b07e7b672489F21d2E05636e";

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
        abi: MulticallAbi,
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
        to: multiCallAddress,
        data: ret,
        value: totalValue,
      };
    };

    const txn = await generate7412CompatibleCall(viemClient, multicallFunc, {
      from: account,
      to: contract.address,
      data,
      value,
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

    const decodedFunctionResult2 = viem.decodeFunctionResult({
      abi: JSON.parse(
        contract.interface.format(ethers.utils.FormatTypes.json).toString(),
      ),
      functionName: fn,
      data: decodedFunctionResult[decodedFunctionResult.length - 1].returnData,
    });

    return decodedFunctionResult2;
  } catch (error) {
    throw error;
  }
};
