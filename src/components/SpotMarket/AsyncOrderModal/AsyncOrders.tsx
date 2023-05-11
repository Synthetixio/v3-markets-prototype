import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { AsyncOrder } from "./AsyncOrder";

interface Props {
  onClose: () => void;
  marketId: number;
}

export const getAsyncOrderIds = (marketId: number) =>
  (JSON.parse(
    localStorage.getItem(`${marketId}-order-ids`) || "[]",
  ) as unknown as string[]) || [];

export const addAsyncOrderId = (marketId: number, orderId: string) => {
  const ids = getAsyncOrderIds(marketId);
  ids.push(orderId);
  const uniqueArray = ids.filter((item, pos) => ids.indexOf(item) == pos);
  localStorage.setItem(`${marketId}-order-ids`, JSON.stringify(uniqueArray));
};
export const removeAsyncOrderId = (marketId: number, orderId: string) => {
  const ids = getAsyncOrderIds(marketId);
  const uniqueArray = ids.filter((item, pos) => ids.indexOf(item) == pos);
  localStorage.setItem(
    `${marketId}-order-ids`,
    JSON.stringify(uniqueArray.filter((id) => id !== orderId)),
  );
};

export function AsyncOrders({ onClose, marketId }: Props) {
  const [list, setList] = useState(getAsyncOrderIds(marketId).reverse());
  return (
    <Flex justifyContent="center" flexWrap="wrap" gap={4} mb="4" w="full">
      {list.map((id) => (
        <AsyncOrder
          key={id}
          asyncOrderId={id}
          marketId={marketId}
          update={() => setList(getAsyncOrderIds(marketId).reverse())}
        />
      ))}
    </Flex>
  );
}
