import { BigNumber, ethers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { useContractWrite } from "wagmi";
import { useApprove } from "../useApprove";
import { useContract } from "../useContract";

export const useSpotMarketBuy = (
  marketId: string | number,
  amount: string,
  slippage: number,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const usd = useContract("USD");
  const spotMarket = useContract("SPOT_MARKET");
  const { approve } = useApprove(usd.address, amount, spotMarket.address);

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: spotMarket.address,
    abi: spotMarket.abi,
    functionName: "buy",
  });

  const buy = useCallback(async () => {
    setIsLoading(true);
    try {
      await approve();
      const txReceipt = await writeAsync({
        recklesslySetUnpreparedArgs: [
          marketId,
          amount,
          BigNumber.from(amount || 0)
            .mul(100 - slippage)
            .div(100)
            .toString(),
          ethers.constants.AddressZero,
        ],
      });
      await txReceipt.wait();
    } catch (error) {
      console.log("error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [approve, writeAsync]);

  return {
    buy,
    isLoading,
  };
};
