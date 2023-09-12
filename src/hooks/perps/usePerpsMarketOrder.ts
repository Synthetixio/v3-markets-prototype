import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useCallback, useState } from "react";
import { useContract } from "../useContract";
import { useTransact } from "../useTransact";
import { usePerpsMarketId } from "./usePerpsMarketId";

export const usePerpsMarketOrder = (
  accountId: string | number,
  sizeDelta: string,
  isBuy: boolean,
  slippage: number,
  onSuccess: () => void,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const perpsMarket = useContract("PERPS_MARKET");
  const market = usePerpsMarketId();

  const { transact } = useTransact();

  const commit = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log({
        marketId: market?.marketId,
        accountId,
      });
      const amountD18 = parseEther(sizeDelta || "0").toString();
      const amount = isBuy ? amountD18 : `-${Number(amountD18).toString()}`;

      let price: BigNumber = await perpsMarket.contract.indexPrice(
        market?.marketId,
      );

      if (isBuy) {
        price = price.mul(110).div(100);
      } else {
        price = price.mul(90).div(100);
      }
      const fillPrice = await perpsMarket.contract.fillPrice(
        market?.marketId,
        amount,
        price,
      );

      const commitment = {
        marketId: market?.marketId,
        accountId,
        sizeDelta: amount,
        settlementStrategyId: 0,
        acceptablePrice: fillPrice.toString(),
        trackingCode: ethers.constants.HashZero,
      };
      await perpsMarket.contract.callStatic.commitOrder(commitment);
      await transact(perpsMarket.contract, "commitOrder", [commitment]);

      onSuccess();
    } catch (error: any) {
      if (error.errorName) {
        console.log("error:", error.errorName);
      } else {
        console.log("error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    market?.marketId,
    accountId,
    sizeDelta,
    isBuy,
    perpsMarket.contract,
    transact,
    onSuccess,
  ]);

  return {
    commit,
    isLoading,
  };
};
