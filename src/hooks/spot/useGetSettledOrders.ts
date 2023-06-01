import { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import { useChainId } from "../useDefaultNetwork";

const GET_SETTLED_ORDERS = gql`
  query GetSettledOrders {
    settledOrders(orderBy: "id", orderDirection: "desc") {
      id
      settler
      finalOrderAmount
      marketId
      asyncOrderId
      collectedFees
      fixedFees
      utilizationFees
      skewFees
      wrapperFees
    }
  }
`;

export interface SettledOrder {
  settler: string;
  marketId: string;
  finalOrderAmount: string;
  collectedFees: string;
  asyncOrderId: string;
  fixedFees: string;
  skewFees: string;
  utilizationFees: string;
  wrapperFees: string;
}
export const useGetSettledOrders = () => {
  const chain = useChainId();
  const { loading, error, data, refetch } = useQuery(GET_SETTLED_ORDERS, {
    context: { clientName: chain === 10 ? "optimism" : "optimismGoerli" },
  });

  const settledOrders = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.settledOrders as SettledOrder[];
  }, [data]);

  return {
    settledOrders,
    refetch,
    loading,
    error,
  };
};
