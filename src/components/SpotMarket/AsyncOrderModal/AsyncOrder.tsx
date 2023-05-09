import {
  Alert,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Text,
} from "@chakra-ui/react";
import { formatUnits } from "ethers/lib/utils.js";
import { useEffect, useMemo, useState } from "react";
import { useContractRead } from "wagmi";
import { TransactionType } from "../../../constants/order";
import { useGetSettlementStrategy } from "../../../hooks/spot/useGetSettlementStrategy";
import { useContract } from "../../../hooks/useContract";
import { useGetBlock } from "../../../hooks/useGetBlock";
import { formatErrorMessage } from "../../../utils/format";
import { removeAsyncOrderId } from "./AsyncOrders";

interface Props {
  marketId: number;
  asyncOrderId: string;
}

export function AsyncOrder({ marketId, asyncOrderId }: Props) {
  const spotMarketProxy = useContract("SPOT_MARKET");
  const oracleVerifier = useContract("OracleVerifier");
  const [canceling, setCanceling] = useState(false);
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

    console.log("fee:", fee.toString());

    const response = await fetch(parsedURL).then((res) => res.json());
    console.log("response:", response);
    try {
      await spotMarketProxy.contract.settlePythOrder(response.data, extraData, {
        value: fee.toString(),
      });
    } catch (error) {
      console.log("error:,", error);
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
    } catch (error) {
      console.log("error in cancel:", error);
    } finally {
      setCanceling(false);
    }
  };

  const ordertype = useMemo(
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
        #{asyncOrderId} - Order Type: {ordertype}
      </Text>
      <Text>
        Amount:{" "}
        {formatUnits(asyncOrderClaim.amountEscrowed.toString(), "ether")}
      </Text>
      <Text>
        Settlement Strategy ID:{" "}
        {asyncOrderClaim.settlementStrategyId.toString()}
      </Text>
      <Text>settlementTime: {asyncOrderClaim.settlementTime.toString()}</Text>
      <Text>
        Minimum Settlement Amount:{" "}
        {asyncOrderClaim.minimumSettlementAmount.toString()}
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
