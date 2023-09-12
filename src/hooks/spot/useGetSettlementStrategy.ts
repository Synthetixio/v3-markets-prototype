import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { useChainContextName } from "../useDefaultNetwork";

const GET_STRATEGIES = gql`
  query GetSettlementStrategies($owner: String, $marketId: String) {
    settlementStrategies(
      orderBy: "id"
      orderDirection: "desc"
      where: { marketId: $marketId }
    ) {
      id
      marketId
      settlementStrategyId
      disabled
      strategyType
      settlementDelay
      settlementWindowDuration
      priceVerificationContract
      feedId
      url
      settlementReward
      priceDeviationTolerance
      minimumUsdExchangeAmount
      maxRoundingLoss
    }
  }
`;

export interface Strategy {
  id: string;
  marketId: string;
  settlementStrategyId: string;
  disabled: boolean;
  strategyType: number;
  settlementDelay: string;
  settlementWindowDuration: string;
  priceVerificationContract: string;
  feedId: string;
  url: string;
  settlementReward: string;
  priceDeviationTolerance: string;
  minimumUsdExchangeAmount: string;
  maxRoundingLoss: string;
}

export const useGetSettlementStrategy = (
  marketId: number,
  strategyId: string,
) => {
  const { loading, data, refetch } = useQuery(GET_STRATEGIES, {
    variables: {
      marketId: marketId.toString(),
    },
    context: { clientName: useChainContextName() },
  });

  const strategies = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.settlementStrategies as Strategy[];
  }, [data]);

  const strategy = useMemo(
    () => strategies?.find((item) => item.settlementStrategyId == strategyId),
    [strategies],
  );

  return {
    strategy,
    strategies,
    refetch,
    loading,
  };
};
