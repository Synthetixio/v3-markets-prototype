import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { useGetSpotClient } from "./useGetSpotClient";

const GET_WRAPPERS = gql`
  query GetSettlementWrappers($owner: String, $marketId: String) {
    wrappers(
      orderBy: "id"
      orderDirection: "desc"
      where: { marketId: $marketId }
    ) {
      id
      marketId
      maxWrappableAmount
      wrapCollateralType
    }
  }
`;

export interface Wrapper {
  id: string;
  marketId: string;
  maxWrappableAmount: string;
  wrapCollateralType: string;
}

export const useGetWrapper = (marketId: number) => {
  const client = useGetSpotClient();

  const { loading, data, refetch } = useQuery(GET_WRAPPERS, {
    variables: {
      marketId: marketId.toString(),
    },
    client,
  });

  const wrapper = useMemo(() => {
    if (!data) {
      return {};
    }

    return data.wrappers[0];
  }, [data]);

  return {
    wrapper: wrapper as Wrapper,
    refetch,
    loading,
  };
};
