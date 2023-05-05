import { Box, Button, Card, CardBody, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useContractRead } from "wagmi";
import { useContract } from "../../../hooks/useContract";
import { formatErrorMessage } from "../../../utils/format";

interface Props {
  marketId: number;
  asyncOrderId: string;
}

export function AsyncOrder({ marketId, asyncOrderId }: Props) {
  const spotMarketProxy = useContract("SPOT_MARKET");
  const oracleVerifier = useContract("OracleVerifier");
  const [asyncOrderClaim, setAsyncOrderClaim] = useState<any | null>(null);

  useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "getAsyncOrderClaim",
    args: [marketId, asyncOrderId],
    onSuccess: (order: any) => {
      setAsyncOrderClaim(order);
    },
  });

  const settle = async () => {
    let url = "";
    let data = " ";
    let extraData = "";
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
  };

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
      <Text>orderType : {asyncOrderClaim.orderType}</Text>
      <Text>amountEscrowed: {asyncOrderClaim.amountEscrowed.toString()}</Text>
      <Text>
        settlementStrategyId: {asyncOrderClaim.settlementStrategyId.toString()}
      </Text>
      <Text>settlementTime: {asyncOrderClaim.settlementTime.toString()}</Text>
      <Text>
        minimumSettlementAmount:{" "}
        {asyncOrderClaim.minimumSettlementAmount.toString()}
      </Text>
      <Button mt="2">Settle</Button>
    </Box>
  );
}
