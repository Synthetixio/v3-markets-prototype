import { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import { useGetSpotClient } from "./useGetSpotClient";

const GET_WRAPP_ORDERS = gql`
  query GetWrappOrders($owner: String, $marketId: String) {
    wrappSynths(
      orderBy: "timestamp"
      orderDirection: "desc"
      where: { marketId: $marketId }
    ) {
      id
      marketId
      amount
      collectedFees
      wrapperFees
      type
      block
      timestamp
    }
  }
`;

export enum WrappOrderType {
  UnWrapped = "UnWrapped",
  Wrapped = "Wrapped",
}

export interface WrappOrder {
  id: string;
  marketId: string;
  amount: string;
  collectedFees: string;
  wrapperFees: string;
  type: WrappOrderType;
  block: string;
  timestamp: string;
}

export const useGetWrappHistory = (marketId: number) => {
  // const { address } = useAccount();

  const client = useGetSpotClient();

  const { loading, error, data, refetch } = useQuery(GET_WRAPP_ORDERS, {
    variables: {
      marketId: marketId?.toString(),
      // owner: showAll ? "" : address?.toLowerCase(),
    },
    notifyOnNetworkStatusChange: true,
    client,
    pollInterval: 20000,
  });

  const orders = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.wrappSynths as WrappOrder[];
  }, [data]);

  return {
    orders,
    refetch,
    loading,
    error,
  };
};
