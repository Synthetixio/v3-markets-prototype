import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useCallback, useState } from "react";
import { useSpotMarketId } from "../spot/useSpotMarketId";
import { useContract } from "../useContract";
import { useTransact } from "../useTransact";
import { usePerpsMarketId } from "./usePerpsMarketId";

export const usePerpsMarketOrder = (
  accountId: string | number,
  sizeDelta: string,
  acceptablePrice: string,
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
      const amount = parseEther(sizeDelta || "0").toString();
      console.log({
        marketId: market?.marketId,
        accountId,
        sizeDelta: amount,
        settlementStrategyId: 0,
        acceptablePrice: amount,
        trackingCode: ethers.constants.HashZero,
      });
      await perpsMarket.contract.callStatic.commitOrder({
        marketId: market?.marketId,
        accountId,
        sizeDelta: amount,
        settlementStrategyId: 0,
        acceptablePrice: amount,
        trackingCode: ethers.constants.HashZero,
      });
      // await transact(perpsMarket.contract, "commitOrder", [
      //   {
      //     marketId: spotMarket?.marketId,
      //     accountId,
      //     sizeDelta,
      //     settlementStrategyId: 0,
      //     acceptablePrice: acceptablePrice,
      //     trackingCode: ethers.constants.HashZero,
      //   },
      // ]);

      onSuccess();
    } catch (error) {
      console.log("error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [accountId, market, sizeDelta, acceptablePrice, transact]);

  return {
    commit,
    isLoading,
  };
};
