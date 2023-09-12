import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { useGetPerpsClient } from "./useGetPerpsClient";

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
      initialMarginRatioD18
      maintenanceMarginRatioD18
      liquidationRewardRatioD18
      maxSecondsInLiquidationWindow
      minimumPositionMargin
      maxLiquidationLimitAccumulationMultiplier
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
  initialMarginRatioD18: string;
  maintenanceMarginRatioD18: string;
  liquidationRewardRatioD18: string;
  maxSecondsInLiquidationWindow: string;
  minimumPositionMargin: string;
  maxLiquidationLimitAccumulationMultiplier: string;
  makerFee: string;
  takerFee: string;
}

export const useMarkets = (marketFilter?: number | string) => {
  const client = useGetPerpsClient();
  const { loading, data, refetch } = useQuery(GET_MARKETS, {
    client,
    notifyOnNetworkStatusChange: true,
  });

  const markets = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.markets as Market[];
  }, [data]);

  const market = useMemo(() => {
    return markets.find((item) =>
      [
        item.marketSymbol?.toUpperCase(),
        item.id,
        item.marketName?.toUpperCase(),
      ].includes(String(marketFilter).toUpperCase()),
    );
  }, [marketFilter, markets]);

  return {
    markets,
    market,
    isLoading: loading,
    refetch,
  };
};
