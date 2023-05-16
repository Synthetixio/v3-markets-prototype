import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useGetSettledOrders } from "../../../hooks/spot/useGetSettledOrders";
import { SettledOrderRow } from "./SettledOrder";

interface Props {
  onClose: () => void;
  marketId: number;
}

export function SettledOrders({ onClose, marketId }: Props) {
  const { settledOrders } = useGetSettledOrders();
  return (
    <Flex justifyContent="center" flexWrap="wrap" gap={4} mb="4" w="full">
      {settledOrders.map((order) => (
        <SettledOrderRow
          key={order.asyncOrderId}
          order={order}
          marketId={marketId}
        />
      ))}
    </Flex>
  );
}
