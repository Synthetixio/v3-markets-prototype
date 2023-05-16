import { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_SETTLED_ORDERS = gql`
  query GetSettledOrders {
    settledOrders {
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
  const { loading, error, data, refetch } = useQuery(GET_SETTLED_ORDERS);

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
