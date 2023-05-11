import { useCallback, useEffect, useState } from "react";
import { useContract } from "../useContract";

export const useGetMarketWrapCollateral = (marketId: number) => {
  const spotMarket = useContract("SPOT_MARKET");

  const [wrapCollateralType, setWrapCollateralType] = useState("");
  const [maxWrappableAmount, setMaxWrappableAmount] = useState("");

  const refetch = useCallback(() => {
    const filter = spotMarket.contract.filters.WrapperSet(marketId);
    spotMarket.contract.queryFilter(filter).then((events) => {
      if (!events[0]) {
        return;
      }

      const data = events[0].args;
      setMaxWrappableAmount(data?.maxWrappableAmount.toString());
      setWrapCollateralType(data?.wrapCollateralType);
    });
  }, []);
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    maxWrappableAmount,
    wrapCollateralType,
    refetch,
  };
};
