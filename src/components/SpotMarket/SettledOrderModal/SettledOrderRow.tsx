import { Td, Text, Tr } from "@chakra-ui/react";
import { formatUnits } from "ethers/lib/utils.js";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useContractRead } from "wagmi";
import { spotMarkets } from "../../../constants/markets";
import { TransactionType } from "../../../constants/order";
import { Order } from "../../../hooks/spot/useGetOrders";
import { useContract } from "../../../hooks/useContract";
import { fromNow } from "../../../utils/date";

interface Props {
  marketId: number;
  order: Order;
}

export function SettledOrderRow({ marketId, order }: Props) {
  const spotMarketProxy = useContract("SPOT_MARKET");

  const orderType = useMemo(
    () =>
      Object.values(TransactionType)[Number(order.orderType.toString())] || "",
    [order.orderType],
  );

  const { marketId: marketSymbol } = useParams();
  const market = spotMarkets[marketSymbol?.toUpperCase() || "ETH"];

  const { inputToken, outputToken } = useMemo(() => {
    let inputToken = "snxUSD";
    let outputToken = market.synth || "";
    if (orderType === TransactionType.ASYNC_SELL) {
      inputToken = market.synth || "";
      outputToken = "snxUSD";
    } else if (orderType === TransactionType.ASYNC_BUY) {
      inputToken = market.synth || "";
      outputToken = "ETH";
    }
    return {
      inputToken,
      outputToken,
    };
  }, [market, orderType]);

  return (
    <>
      <Tr>
        <Td>
          #{order.asyncOrderId} ({orderType == "ASYNC_BUY" ? "Buy" : "Sell"})
        </Td>
        <Td>
          {formatUnits(order.finalOrderAmount || "0", "ether")}{" "}
          {orderType == "ASYNC_BUY" ? "snxETH" : "snxUSD"}
        </Td>
        <Td>{formatUnits(order.fixedFees || "0", "ether")} snxUSD</Td>
        <Td>{formatUnits(order.skewFees || "0", "ether")} snxUSD</Td>
        <Td>{formatUnits(order.wrapperFees || "0", "ether")} snxUSD</Td>
        <Td>{formatUnits(order.collectedFees || "0", "ether")} snxUSD</Td>
        <Td>{formatUnits(order.utilizationFees || "0", "ether")}</Td>
        <Td>
          <Text>
            Order Amount: {formatUnits(order.amountEscrowed, "ether")}{" "}
            {inputToken}
          </Text>
          <Text my={2}>
            Settlement Strategy ID: {order.settlementStrategyId}
          </Text>
          {order.settledAt !== "0" && (
            <Text>
              Settlement Time: {fromNow(Number(order.settledAt) * 1000)}
            </Text>
          )}
          <Text>Settler: {order.settler || "0"}</Text>
        </Td>
      </Tr>
    </>
  );
}
