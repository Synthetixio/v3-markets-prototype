import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useCallback, useState } from "react";
import { useContract } from "../useContract";
import { useTransact } from "../useTransact";
import { useActivePerpsMarket } from "./useActivePerpsMarket";
import { readMulticall } from "../../utils/readMulticall";
import { useAccount, useProvider } from "wagmi";

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

  const commit = useCallback(async () => {
    setIsLoading(true);
    try {
      const amountD18 = parseEther(sizeDelta || "0").toString();
      const amount = isBuy ? amountD18 : `-${Number(amountD18).toString()}`;

      console.log("getting indexPrice!");
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

      const commitment = {
        marketId: market?.id,
        accountId: Number(accountId),
        sizeDelta: amount,
        settlementStrategyId: 0,
        acceptablePrice: fillPrice.toString(),
        trackingCode: ethers.constants.HashZero,
        referrer: ethers.constants.AddressZero,
      };

      await transact(perpsMarket.contract, "commitOrder", [commitment], 10n);

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
