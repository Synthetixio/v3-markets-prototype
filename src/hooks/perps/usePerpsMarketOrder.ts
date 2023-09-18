import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useCallback, useEffect, useState } from "react";
import { useContract } from "../useContract";
import { useTransact } from "../useTransact";
import { useActivePerpsMarket } from "./useActivePerpsMarket";
import { readMulticall } from "../../utils/readMulticall";
import { useAccount, useProvider } from "wagmi";
import { decodeFunctionResult } from "viem";
import Multicall from "../../constants/TrustedMulticallForwarder.json";

export const usePerpsMarketOrder = (
  accountId: string | number,
  sizeDelta: string,
  isBuy: boolean,
  slippage: number,
  onSuccess: () => void,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const perpsMarket = useContract("PERPS_MARKET");
  const { market } = useActivePerpsMarket();

  const provider = useProvider();
  const account = useAccount();

  const { transact } = useTransact();

  // useEffect(() => {
  //   const value = decodeFunctionResult({
  //     abi: Multicall.abi,
  //     functionName: "aggregate3Value",
  //     data: "0x1e4cbb75",
  //   });
  // }, []);

  const commit = useCallback(async () => {
    setIsLoading(true);
    try {
      const amountD18 = parseEther(sizeDelta || "0").toString();
      const amount = isBuy ? amountD18 : `-${Number(amountD18).toString()}`;

      let price = (await readMulticall(
        perpsMarket.contract,
        "indexPrice",
        [market?.id],
        provider,
        account.address,
      )) as unknown as bigint;

      if (isBuy) {
        price = (price * 110n) / 100n;
      } else {
        price = (price * 90n) / 100n;
      }

      const fillPrice = await perpsMarket.contract.fillPrice(
        market?.id,
        amount,
        price,
      );

      console.log(fillPrice);

      const commitment = {
        marketId: market?.id,
        accountId: accountId.toString(),
        sizeDelta: amount,
        settlementStrategyId: 0,
        acceptablePrice: fillPrice.toString(),
        trackingCode: ethers.constants.HashZero,
        referrer: ethers.constants.AddressZero,
      };
      console.log(commitment);

      console.log("----------------------------------- transact starts!");

      // const viemClient = viem.createPublicClient({
      //   transport: viem.custom({
      //     request: ({ method, params }) =>
      //       (provider as any).send(method, params),
      //   }),
      // });

      // const data = perpsMarket.contract.interface.encodeFunctionData(
      //   "commitOrder",
      //   [commitment],
      // );

      // const result = await viemClient.call({
      //   account: account.address,
      //   to: perpsMarket.contract.address,
      //   data,
      //   value: 10n,
      // });

      // console.log({
      //   result,
      // });
      // await perpsMarket.contract.callStatic.commitOrder(commitment);

      await transact(perpsMarket.contract, "commitOrder", [commitment]);

      onSuccess();
    } catch (error: any) {
      console.log("error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    sizeDelta,
    isBuy,
    perpsMarket.contract,
    market?.id,
    provider,
    account.address,
    accountId,
    transact,
    onSuccess,
  ]);

  return {
    commit,
    isLoading,
  };
};
