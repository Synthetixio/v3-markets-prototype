import { formatEther } from "ethers/lib/utils.js";
import { useContractRead, useNetwork } from "wagmi";
import { useContract } from "../useContract";

export const useSpotMarketInfo = (marketId: string | number | undefined) => {
  const spotMarketProxy = useContract("SPOT_MARKET");

  const { data: synthAddress } = useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "getSynth",
    args: [marketId],
    enabled: !!marketId,
  });

  const { data: marketName } = useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "name",
    args: [marketId],
    enabled: !!marketId,
  });

  const { data: marketFees } = useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "getMarketFees",
    args: [marketId],
    enabled: !!marketId,
  });

  const { data: marketSkewScale } = useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "getMarketSkewScale",
    args: [marketId],
    enabled: !!marketId,
  });

  return {
    synthAddress: synthAddress as string,
    marketName: marketName as string,
    asyncFixedFee: formatEther(marketFees?.asyncFixedFee.mul(100) || "0"),
    wrapFee: formatEther(marketFees?.wrapFee.mul(100) || "0"),
    unwrapFee: formatEther(marketFees?.unwrapFee.mul(100) || "0"),
    marketSkewScale: formatEther(marketSkewScale?.toString() || "0"),
  };
};

export const useSpotMarketStat = (marketId: string | number) => {
  const spotMarketProxy = useContract("SPOT_MARKET");
  const synthetixProxy = useContract("SYNTHETIX");

  const { data: reportedDebt } = useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "reportedDebt",
    args: [marketId],
    enabled: !!marketId,
  });
  const { data: wrappedAmount } = useContractRead({
    address: synthetixProxy.address,
    abi: synthetixProxy.abi,
    functionName: "getMarketCollateralAmount",
    args: [marketId, "0x4200000000000000000000000000000000000006"],
    enabled: !!marketId,
  });

  return {
    reportedDebt: formatEther(reportedDebt?.toString() || "0"),
    wrappedAmount: formatEther(wrappedAmount?.toString() || "0"),
  };
};
