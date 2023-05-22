import { Td, Text, Tr } from "@chakra-ui/react";
import Wei from "@synthetixio/wei";
import dayjs from "dayjs";
import { formatUnits } from "ethers/lib/utils.js";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { spotMarkets } from "../../../../constants/markets";
import { TransactionType } from "../../../../constants/order";
import { Order } from "../../../../hooks/spot/useGetOrders";
import { prettyString } from "../../../../utils/format";
import { Amount } from "../../../Amount";

interface Props {
  marketId: number;
  order: Order;
}

export function SettledOrderRow({ marketId, order }: Props) {
  const orderType = useMemo(
    () => Number(order.orderType.toString()),
    [order.orderType],
  );

  const { marketId: marketSymbol } = useParams();
  const market = spotMarkets[marketSymbol?.toUpperCase() || "ETH"];

  const { inputToken, outputToken } = useMemo(() => {
    let inputToken = "";
    let outputToken = market.synth || "";

    if (orderType === TransactionType.ASYNC_SELL) {
      inputToken = market.synth || "";
      outputToken = "snxUSD";
    } else if (orderType === TransactionType.ASYNC_BUY) {
      inputToken = "snxUSD";
      outputToken = market.synth || "";
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
          #{order.asyncOrderId} (
          {orderType == TransactionType.ASYNC_BUY ? "Buy" : "Sell"})
        </Td>
        <Td>
          <Amount
            value={new Wei(formatUnits(order.finalOrderAmount || "0", "ether"))}
            suffix={outputToken}
          />
        </Td>
        <Td>
          <Amount
            value={new Wei(formatUnits(order.fixedFees || "0", "ether"))}
            suffix="snxUSD"
          />
        </Td>
        <Td>
          <Amount
            value={new Wei(formatUnits(order.skewFees || "0", "ether"))}
            suffix="snxUSD"
          />
        </Td>
        <Td>
          <Amount
            value={new Wei(formatUnits(order.utilizationFees || "0", "ether"))}
            suffix="snxUSD"
          />
        </Td>
        <Td>
          <Amount
            value={new Wei(formatUnits(order.collectedFees || "0", "ether"))}
            suffix="snxUSD"
          />
        </Td>
        <Td>
          {dayjs(Number(order.settledAt) * 1000).format("YYYY/MM/DD - HH:mm")}
        </Td>

        <Td>
          <Text>
            Order Amount:
            <Amount
              value={new Wei(formatUnits(order.amountEscrowed || "0", "ether"))}
              suffix={inputToken}
            />
          </Text>
          <Text my={2}>
            Settlement Strategy ID: {order.settlementStrategyId}
          </Text>
          <Text my={2}>Settler: {prettyString(order.settler || "")}</Text>
          <Text>Owner: {prettyString(order.owner || "")}</Text>
        </Td>
      </Tr>
    </>
  );
}
