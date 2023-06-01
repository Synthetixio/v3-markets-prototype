import { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import { useAccount } from "wagmi";
import { useChainId } from "../useDefaultNetwork";

const GET_ORDERS = gql`
  query GetOrders($owner: String, $marketId: String) {
    orders(
      orderBy: "timestamp"
      orderDirection: "desc"
      where: { owner_contains: $owner, marketId: $marketId }
    ) {
      id
      marketId
      amountProvided
      asyncOrderId
      orderType
      referrer
      finalOrderAmount
      collectedFees
      settler
      fixedFees
      skewFees
      utilizationFees
      wrapperFees
      status
      owner
      amountEscrowed
      settlementStrategyId
      settlementTime
      minimumSettlementAmount
      settledAt
      block
      timestamp
    }
  }
`;

export interface Order {
  id: string;
  marketId: string;
  amountProvided: string;
  asyncOrderId: string;
  orderType: string;
  referrer: string;
  finalOrderAmount: string;
  collectedFees: string;
  settler: string;
  fixedFees: string;
  skewFees: string;
  utilizationFees: string;
  wrapperFees: string;
  status: string;
  owner: string;
  amountEscrowed: string;
  settlementStrategyId: string;
  settlementTime: string;
  minimumSettlementAmount: string;
  settledAt: string;
  block: string;
  timestamp: string;
}

export enum OrderStatus {
  Commited = "Commited",
  Cancelled = "Cancelled",
  Settled = "Settled",
}

export const useGetOrders = (marketId: number, showAll: boolean) => {
  const { address } = useAccount();

  const chain = useChainId();
  const { loading, error, data, refetch } = useQuery(GET_ORDERS, {
    variables: {
      marketId: marketId.toString(),
      owner: showAll ? "" : address?.toLowerCase(),
    },
    notifyOnNetworkStatusChange: true,
    context: { clientName: chain === 10 ? "optimism" : "optimismGoerli" },
  });

  const orders = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.orders as Order[];
  }, [data, showAll]);

  return {
    orders,
    refetch,
    loading,
    error,
  };
};
