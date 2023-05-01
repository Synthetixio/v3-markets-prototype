import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { useContractRead } from "wagmi";
import { useContract } from "../useContract";

export const useSpotMarketInfo = (marketId: string | number) => {
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

  return {
    synthAddress: synthAddress as string,
    marketName: marketName as string,
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
  const { data: withdrawableMarketUsd } = useContractRead({
    address: synthetixProxy.address,
    abi: synthetixProxy.abi,
    functionName: "getWithdrawableMarketUsd",
    args: [marketId],
    enabled: !!marketId,
  });

  return {
    reportedDebt: formatEther(reportedDebt?.toString() || "0"),
    withdrawableMarketUsd: formatEther(
      withdrawableMarketUsd?.toString() || "0",
    ),
  };
};
