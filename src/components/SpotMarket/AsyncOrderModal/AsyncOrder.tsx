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
import { useMemo, useState } from "react";
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
    let url = "";
    let data = " ";
    let extraData = "";

    try {
      await spotMarketProxy.contract.callStatic.settleOrder(
        marketId,
        asyncOrderId,
      );
    } catch (error) {
      console.log("settleOrder error", error);
    }
    try {
      const tx = await spotMarketProxy.contract.settleOrder(
        marketId,
        asyncOrderId,
      );
      await tx.wait();
    } catch (err) {
      const parseString = (str: string) =>
        str.trim().replace('"', "").replace('"', "");
      const parsedError = formatErrorMessage(err)
        .replace("OffchainLookup(", "")
        .replace(")", "")
        .split(",");

      url = parseString(parsedError[1]);
      data = parseString(parsedError[2]);
      extraData = parseString(parsedError[4].split("\n")[0]);

      console.log({
        url,
        data,
        extraData,
      });
    }

    const fee = await oracleVerifier.contract.getUpdateFee(1);
    const parsedURL = url.replace("{data}", data);

    const response = await fetch(parsedURL).then((res) => res.json());
    console.log("response:", response);
    await spotMarketProxy.contract.settlePythOrder(response.data, extraData, {
      value: fee.toString(),
    });
  };

  const cancel = async () => {
    try {
      const tx = await spotMarketProxy.contract.cancelOrder(
        marketId,
        asyncOrderId,
      );
      await tx.wait();
      removeAsyncOrderId(marketId, asyncOrderId);
    } catch (error) {}
  };
  const ordertype = useMemo(
    () =>
      Object.values(TransactionType)[
        Number(asyncOrderClaim?.orderType.toString())
      ] || "",
    [],
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

  if (!asyncOrderClaim) {
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
      <Text>orderType : {ordertype}</Text>
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
        >
          Cancel
        </Button>
      </Flex>
    </Box>
  );
}
