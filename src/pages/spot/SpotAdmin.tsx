import { Flex } from "@chakra-ui/react";
import { Header } from "../../components";
import { SpotMarketFee } from "../../components/SpotMarket/SpotMarketFee";
import { SpotMarketSettlementStrategy } from "../../components/SpotMarket/SpotMarketSettlementStrategy";
import { FeeType } from "../../constants/order";

export function SpotAdmin() {
  return (
    <Flex height="100vh" maxHeight="100vh" flexDirection="column">
      <Header isSpot />
      <Flex
        m={8}
        align="start"
        direction="row"
        flex="1"
        height="100%"
        minHeight={0}
        gap={4}
        flexWrap="wrap"
      >
        <SpotMarketFee type={FeeType.FIXED} />
        <SpotMarketFee type={FeeType.UTILIZATION} />
        <SpotMarketFee type={FeeType.SKEW_SCALE} />
        <SpotMarketFee type={FeeType.ASYNC_FIXED} />
        <SpotMarketSettlementStrategy />
      </Flex>
    </Flex>
  );
}
