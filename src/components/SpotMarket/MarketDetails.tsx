import { Box, Heading } from "@chakra-ui/react";
import { useToken } from "wagmi";
import {
  useSpotMarketInfo,
  useSpotMarketStat,
} from "../../hooks/spot/useSpotMarketInfo";

export function MarketDetails({ id }: { id: number }) {
  const { synthAddress, marketName } = useSpotMarketInfo(id);
  const { reportedDebt, withdrawableMarketUsd } = useSpotMarketStat(id);
  const { data: tokenInfo } = useToken({
    address: synthAddress as `0x${string}`,
  });

  if (!id || !synthAddress) {
    return null;
  }

  return (
    <Box p="4">
      <Heading size="md" mb="3">
        Market Details
      </Heading>

      <Box mb="2">
        <Heading size="xs">Name</Heading>
        {marketName}
      </Box>

      <Box mb="2">
        <Heading size="xs">Synth Address</Heading>
        {synthAddress}
      </Box>

      <Box mb="2">
        <Heading size="xs">Market Price</Heading>
        $0
      </Box>

      <Box mb="2">
        <Heading size="xs">
          <>{tokenInfo?.symbol} Issued</>
        </Heading>
        {Number(reportedDebt).toLocaleString("en-US")}
      </Box>

      <Box mb="2">
        <Heading size="xs">snxUSD Deposited</Heading>
        $0
      </Box>

      <Box mb="2">
        <Heading size="xs">Market Collateralization</Heading>
        $0
      </Box>

      <Box mb="2">
        <Heading size="xs">Market Credit Capacity</Heading>
        $0
      </Box>

      <Box mb="2">
        <Heading size="xs">Market Withdrawable Usd</Heading>
        {Number(withdrawableMarketUsd).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </Box>
    </Box>
  );
}
