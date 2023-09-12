import { Td, Text, Tr } from "@chakra-ui/react";
import dayjs from "dayjs";
import { formatUnits } from "ethers/lib/utils.js";
import { useMemo } from "react";
import { TransactionType } from "../../../../constants/order";
import { Order } from "../../../../hooks/spot/useGetOrders";

interface Props {
  marketId: number;
  order: Order;
}

export function CancelledOrderRow({ order }: Props) {
  const orderType = useMemo(() => Number(order.orderType), [order.orderType]);

  return (
    <>
      <Tr>
        <Td>
          #{order.asyncOrderId} (
          {orderType === TransactionType.ASYNC_BUY ? "Buy" : "Sell"})
        </Td>
        <Td>
          {formatUnits(order.amountEscrowed || "0", "ether")}{" "}
          {orderType === TransactionType.ASYNC_BUY ? "snxETH" : "snxUSD"}
        </Td>
        <Td>
          {dayjs(Number(order.timestamp) * 1000).format("YYYY/MM/DD - HH:mm")}
          <br />
          <br />
          Block: {order.block}
        </Td>
        <Td>
          <Text>Settlement Strategy ID: {order.settlementStrategyId}</Text>
          {order.settledAt !== "0" && (
            <Text my={2}>
              Settlement Time:{" "}
              {dayjs(Number(order.settledAt) * 1000).format(
                "YYYY/MM/DD - HH:mm",
              )}
            </Text>
          )}
          <Text>Owner: {order.owner || ""}</Text>
        </Td>
      </Tr>
    </>
  );
}
