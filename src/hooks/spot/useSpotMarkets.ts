import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { useGetSpotClient } from "./useGetSpotClient";

const GET_MARKETS = gql`
  query {
    markets {
      id
      marketId
      buyFeedId
      sellFeedId
      synth
      marketName
      marketSymbol
    }
  }
`;

export interface SpotMarket {
  id: string;
  marketId: string;
  buyFeedId: string;
  sellFeedId: string;
  synth: string;
  marketName: string;
  marketSymbol: string;
}

export const useSpotMarkets = (marketFilter?: number | string) => {
  const client = useGetSpotClient();
  const { loading, data, refetch } = useQuery(GET_MARKETS, {
    client,
    notifyOnNetworkStatusChange: true,
  });

  const markets = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.markets as SpotMarket[];
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
