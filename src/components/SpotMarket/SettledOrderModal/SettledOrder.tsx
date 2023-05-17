import { Box, Divider, Td, Text, Tr } from "@chakra-ui/react";
import { formatUnits } from "ethers/lib/utils.js";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useContractRead } from "wagmi";
import { spotMarkets } from "../../../constants/markets";
import { TransactionType } from "../../../constants/order";
import { SettledOrder } from "../../../hooks/spot/useGetSettledOrders";
import { useGetSettlementStrategy } from "../../../hooks/spot/useGetSettlementStrategy";
import { useContract } from "../../../hooks/useContract";
import { useGetBlock } from "../../../hooks/useGetBlock";
import { fromNow } from "../../../utils/date";

interface Props {
  marketId: number;
  order: SettledOrder;
}

export function SettledOrderRow({ marketId, order }: Props) {
  const spotMarketProxy = useContract("SPOT_MARKET");
  const [asyncOrderClaim, setAsyncOrderClaim] = useState<any | null>(null);

  useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "getAsyncOrderClaim",
    args: [marketId, order.asyncOrderId],
    onSuccess: (order: any) => {
      setAsyncOrderClaim(order);
    },
  });

  const orderType = useMemo(
    () =>
      Object.values(TransactionType)[
        Number(asyncOrderClaim?.orderType.toString())
      ] || "",
    [asyncOrderClaim?.orderType],
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
          #{order.asyncOrderId} - {orderType}
        </Td>
        <Td>{formatUnits(order.finalOrderAmount, "ether")} </Td>
        <Td>{order.collectedFees}</Td>
        <Td>{formatUnits(order.fixedFees, "ether")}</Td>
        <Td>{formatUnits(order.skewFees, "ether")}</Td>
        <Td>{formatUnits(order.wrapperFees, "ether")}</Td>
        <Td>{formatUnits(order.utilizationFees, "ether")}</Td>
        <Td>
          <Text>Settler: {order.settler}</Text>
          {asyncOrderClaim && (
            <>
              <Text>
                Order Amount:{" "}
                {formatUnits(
                  asyncOrderClaim.amountEscrowed.toString(),
                  "ether",
                )}{" "}
                {inputToken}
              </Text>
              <Text>
                Settlement Strategy ID:{" "}
                {asyncOrderClaim.settlementStrategyId.toString()}
              </Text>
              <Text>
                Settlement Time:{" "}
                {fromNow(asyncOrderClaim.settledAt.toNumber() * 1000)}
              </Text>
            </>
          )}
        </Td>
      </Tr>
    </>
  );
}
