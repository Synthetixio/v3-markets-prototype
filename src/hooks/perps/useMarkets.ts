import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { perpsClient } from "../../utils/clients";

const GET_MARKETS = gql`
  query {
    markets {
      id
      perpsMarketId
      marketOwner
      marketName
      marketSymbol
      feedId
      owner
      maxFundingVelocity
      skewScale
      initialMarginFraction
      maintenanceMarginFraction
      liquidationRewardRatioD18
      maxLiquidationLimitAccumulationMultiplier
      lockedOiPercent
      makerFee
      takerFee
    }
  }
`;

export interface Market {
  id: string;
  perpsMarketId: string;
  marketOwner: string;
  marketName: string;
  marketSymbol: string;
  feedId: string;
  owner: string;
  maxFundingVelocity: string;
  skewScale: string;
  initialMarginFraction: string;
  maintenanceMarginFraction: string;
  liquidationRewardRatioD18: string;
  maxLiquidationLimitAccumulationMultiplier: string;
  lockedOiPercent: string;
  makerFee: string;
  takerFee: string;
}

export const useMarkets = (marketId: number | string | undefined) => {
  const { loading, data, refetch } = useQuery(GET_MARKETS, {
    client: perpsClient,
    notifyOnNetworkStatusChange: true,
  });

  const markets = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.markets as Market[];
  }, [data]);

  const market = useMemo(() => {
    return markets.find((item) => item.id === marketId?.toString());
  }, [data]);

  return {
    markets,
    market,
    isLoading: loading,
    refetch,
  };
};
