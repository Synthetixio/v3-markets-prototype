import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useContractWrite } from "wagmi";
import { useContract } from "./useContract";
import { useStrategyType } from "./useStrategyType";

export const useAddSettlementStrategy = (marketId: string) => {
  const StrategyType = useStrategyType();
  const coreProxy = useContract("PERPS_MARKET");

  const strategy = {
    strategyType: StrategyType.ONCHAIN,
    settlementDelay: 5,
    settlementWindowDuration: 120,
    priceVerificationContract: ethers.constants.AddressZero,
    feedId: ethers.constants.HashZero,
    url: "",
    settlementReward: parseEther("5"),
    priceDeviationTolerance: parseEther("0.01"),
  };

  const { writeAsync: addSettlementStrategy } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: coreProxy.address,
    abi: coreProxy.abi,
    functionName: "addSettlementStrategy",
    args: [marketId, strategy],
  });

  return {
    addSettlementStrategy,
  };
};
