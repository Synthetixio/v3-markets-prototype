import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { AsyncOrder } from "./AsyncOrder";

interface Props {
  onClose: () => void;
  marketId: number;
}

export const getOrderIds = (marketId: number) =>
  (JSON.parse(
    localStorage.getItem(`${marketId}-order-ids`) || "[]",
  ) as unknown as string[]) || [];

export const addOrderId = (marketId: number, orderId: string) => {
  const ids = getOrderIds(marketId);
  ids.push(orderId);
  const uniqueArray = ids.filter((item, pos) => ids.indexOf(item) == pos);
  localStorage.setItem(`${marketId}-order-ids`, JSON.stringify(uniqueArray));
};

export function AsyncOrders({ onClose, marketId }: Props) {
  const [list] = useState(getOrderIds(marketId));
  return (
    <Flex>
      {list.map((id) => (
        <AsyncOrder asyncOrderId={id} marketId={marketId} />
      ))}
    </Flex>
  );
}
