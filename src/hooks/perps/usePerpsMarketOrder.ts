import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useCallback, useState } from "react";
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

      const price2 = await perpsMarket.contract.indexPrice(market?.marketId);

      const fillPrice = await perpsMarket.contract.fillPrice(
        market?.marketId,
        amount,
        price2,
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
  }, [accountId, market, sizeDelta, acceptablePrice, transact]);

  return {
    commit,
    isLoading,
  };
};
