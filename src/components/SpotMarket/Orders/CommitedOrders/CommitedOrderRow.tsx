import { Button, Flex, Td, Text, Toast, Tr, useToast } from "@chakra-ui/react";
import Wei from "@synthetixio/wei";
import { formatUnits } from "ethers/lib/utils.js";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { spotMarkets } from "../../../../constants/markets";
import { TransactionType } from "../../../../constants/order";
import { Order } from "../../../../hooks/spot/useGetOrders";
import { fromNow } from "../../../../utils/date";
import { prettyString } from "../../../../utils/format";
import { Amount } from "../../../Amount";
import { useGetSettlementStrategy } from "../../../../hooks/spot/useGetSettlementStrategy";
import { useContract } from "../../../../hooks/useContract";
import { useMarketId } from "../../../../hooks/useMarketId";

interface Props {
  marketId: number;
  order: Order;
  refetch: () => void;
  block: number;
}

export function CommitedOrderRow({ marketId, order, block }: Props) {
  const spotMarketProxy = useContract("SPOT_MARKET");
  const oracleVerifier = useContract("OracleVerifier");
  const [canceling, setCanceling] = useState(false);
  const [settling, setSettling] = useState(false);

  const orderType = useMemo(
    () => Number(order.orderType.toString()),
    [order.orderType],
  );

  const toast = useToast({
    isClosable: true,
    duration: 9000,
  });
  const market = useMarketId();

  const { inputToken } = useMemo(() => {
    let inputToken = "";
    let outputToken = market?.synth || "";

    if (orderType === TransactionType.ASYNC_SELL) {
      inputToken = market?.synth || "";
      outputToken = "snxUSD";
    } else if (orderType === TransactionType.ASYNC_BUY) {
      inputToken = "snxUSD";
      outputToken = market?.synth || "";
    }
    return {
      inputToken,
      outputToken,
    };
  }, [market, orderType]);

  const { strategy } = useGetSettlementStrategy(
    marketId,
    order.settlementStrategyId,
  );

  const outsideSettlementWindow = useMemo(() => {
    if (!block || !strategy?.settlementWindowDuration) return false;

    const startTime = Number(order.settlementTime);
    const expirationTime =
      startTime + Number(strategy.settlementWindowDuration);

    if (block < startTime || block >= expirationTime) {
      return true;
    }
    return false;
  }, [order, strategy, block]);

  const settle = async () => {
    let urls = "";
    let data = " ";
    let extraData = "";
    setSettling(true);

    try {
      await spotMarketProxy.contract.callStatic.settleOrder(
        marketId,
        order.asyncOrderId,
      );
    } catch (error: any) {
      urls = error.errorArgs.urls;
      data = error.errorArgs.callData;
      extraData = error.errorArgs.extraData;
    }

    if (!urls || !data || !extraData) {
      setSettling(false);
      return;
    }

    const fee = await oracleVerifier.contract.getUpdateFee(1);
    const parsedURL = urls[0].replace("{data}", data);

    const response = await fetch(parsedURL)
      .then((res) => res.json())
      .catch(() => {
        setSettling(false);
      });

    if (!response) {
      setSettling(false);
      return;
    }

    try {
      const tx = await spotMarketProxy.contract.settlePythOrder(
        response.data,
        extraData,
        {
          value: fee.toString(),
        },
      );
      await tx.wait();

      toast({
        title: "Successfully done",
        description: "Refresh in a few seconds",
        status: "success",
      });
    } catch (error) {
      console.log("error:,", error);
    } finally {
      setSettling(false);
    }
  };

  const cancel = async () => {
    try {
      setCanceling(true);
      const tx = await spotMarketProxy.contract.cancelOrder(
        marketId,
        order.asyncOrderId,
      );
      await tx.wait();

      toast({
        title: "Successfully done",
        description: "Refresh in a few seconds",
        status: "success",
      });
    } catch (error) {
      console.log("error in cancel:", error);
    } finally {
      setCanceling(false);
    }
  };

  return (
    <>
      <Tr>
        <Td>
          #{order.asyncOrderId} (
          {orderType == TransactionType.ASYNC_BUY ? "Buy" : "Sell"})
        </Td>
        <Td>
          <Amount
            value={new Wei(formatUnits(order.amountEscrowed || "0", "ether"))}
            suffix={inputToken}
          />
        </Td>
        <Td>
          <Text>
            Settlement Time: {fromNow(Number(order.settlementTime) * 1000)}
          </Text>

          <Text my={2}>
            Settlement Strategy ID: {order.settlementStrategyId}
          </Text>

          <Text>Owner: {prettyString(order.owner || "")}</Text>
        </Td>
        <Td>
          <Flex alignItems="center" mt="2">
            <Button
              isDisabled={outsideSettlementWindow || !block}
              onClick={settle}
              isLoading={settling}
            >
              Settle
            </Button>
            <Button
              colorScheme="red"
              isDisabled={!outsideSettlementWindow || !block}
              ml="2"
              onClick={cancel}
              isLoading={canceling}
            >
              Cancel
            </Button>
          </Flex>
        </Td>
      </Tr>
    </>
  );
}
