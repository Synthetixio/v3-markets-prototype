import { useContractRead } from "wagmi";
import { useContract } from "../useContract";

export const useGetSettlementStrategy = (
  marketId: number,
  strategyId: string,
) => {
  const contract = useContract("SPOT_MARKET");

  const { data: strategy } = useContractRead({
    address: contract.address,
    abi: contract.abi,
    functionName: "getSettlementStrategy",
    args: [marketId, strategyId],
  });

  return {
    strategy: strategy as any,
  };
};
