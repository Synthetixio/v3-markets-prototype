import { Alert, Box, Button, Flex, Text } from "@chakra-ui/react";
import { formatUnits } from "ethers/lib/utils.js";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useContractRead } from "wagmi";
import { spotMarkets } from "../../../constants/markets";
import { TransactionType } from "../../../constants/order";
import { useGetSettlementStrategy } from "../../../hooks/spot/useGetSettlementStrategy";
import { useContract } from "../../../hooks/useContract";
import { useGetBlock } from "../../../hooks/useGetBlock";
import { fromNow } from "../../../utils/date";
import { removeAsyncOrderId } from "./AsyncOrders";

interface Props {
  marketId: number;
  asyncOrderId: string;
  update: () => void;
}

export function AsyncOrder({ marketId, asyncOrderId, update }: Props) {
  const spotMarketProxy = useContract("SPOT_MARKET");
  const oracleVerifier = useContract("OracleVerifier");
  const [canceling, setCanceling] = useState(false);
  const [settling, setSettling] = useState(false);
  const [asyncOrderClaim, setAsyncOrderClaim] = useState<any | null>(null);

  const { timestamp } = useGetBlock();

  useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "getAsyncOrderClaim",
    args: [marketId, asyncOrderId],
    onSuccess: (order: any) => {
      setAsyncOrderClaim(order);
    },
  });

  const { strategy } = useGetSettlementStrategy(
    marketId,
    asyncOrderClaim?.settlementStrategyId,
  );

  const settle = async () => {
    let urls = "";
    let data = " ";
    let extraData = "";
    setSettling(true);

    try {
      await spotMarketProxy.contract.callStatic.settleOrder(
        marketId,
        asyncOrderId,
      );
    } catch (error: any) {
      urls = error.errorArgs.urls;
      data = error.errorArgs.callData;
      extraData = error.errorArgs.extraData;

      console.log({
        urls,
        data,
        extraData,
      });
    }

    const fee = await oracleVerifier.contract.getUpdateFee(1);
    const parsedURL = urls[0].replace("{data}", data);

    const response = await fetch(parsedURL)
      .then((res) => res.json())
      .catch(() => {
        setSettling(false);
      });

    if (!response) {
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
      removeAsyncOrderId(marketId, asyncOrderId);
      update();
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
        asyncOrderId,
      );
      await tx.wait();
      removeAsyncOrderId(marketId, asyncOrderId);
      update();
    } catch (error) {
      console.log("error in cancel:", error);
    } finally {
      setCanceling(false);
    }
  };

  const orderType = useMemo(
    () =>
      Object.values(TransactionType)[
        Number(asyncOrderClaim?.orderType.toString())
      ] || "",
    [asyncOrderClaim?.orderType],
  );

  const outsideSettlementWindow = useMemo(() => {
    if (!timestamp || !asyncOrderClaim || !strategy?.settlementWindowDuration)
      return false;

    const startTime = Number(asyncOrderClaim.settlementTime);
    const expirationTime =
      startTime + Number(strategy.settlementWindowDuration);

    if (timestamp < startTime || timestamp >= expirationTime) {
      return true;
    }
    return false;
  }, [asyncOrderClaim, timestamp]);

  useEffect(() => {
    if (asyncOrderClaim && !asyncOrderClaim.settledAt.eq(0)) {
      removeAsyncOrderId(marketId, asyncOrderId);
    }
  }, [asyncOrderClaim]);

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

  if (
    !asyncOrderClaim ||
    (asyncOrderClaim && !asyncOrderClaim.settledAt.eq(0))
  ) {
    return null;
  }

  return (
    <Box
      w="full"
      p="6"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Text>
        #{asyncOrderId} - Order Type: {orderType}
      </Text>
      <Text>
        Amount:{" "}
        {formatUnits(asyncOrderClaim.amountEscrowed.toString(), "ether")}{" "}
        {inputToken}
      </Text>
      <Text>
        Settlement Strategy ID:{" "}
        {asyncOrderClaim.settlementStrategyId.toString()}
      </Text>
      <Text>
        Settlement Time:{" "}
        {fromNow(asyncOrderClaim.settlementTime.toNumber() * 1000)}
      </Text>
      <Text>
        Minimum Settlement Amount:{" "}
        {asyncOrderClaim.minimumSettlementAmount.toString()} {outputToken}
      </Text>
      {outsideSettlementWindow && (
        <Alert colorScheme="red" rounded="lg" my="2">
          Outside Settlement Window
        </Alert>
      )}
      <Flex alignItems="center" mt="2">
        <Button isDisabled={outsideSettlementWindow} onClick={settle}>
          Settle
        </Button>
        <Button
          colorScheme="red"
          isDisabled={!outsideSettlementWindow}
          ml="2"
          onClick={cancel}
          isLoading={canceling}
        >
          Cancel
        </Button>
      </Flex>
    </Box>
  );
}
