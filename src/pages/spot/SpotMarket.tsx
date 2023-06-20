import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Header } from "../../components";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { MarketDetails } from "../../components/SpotMarket/MarketDetails";
import { SpotMarketForm } from "../../components/SpotMarket/SpotMarketForm";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { useMarketId } from "../../hooks/spot/useMarketId";

export function SpotMarket() {
  const market = useMarketId();

  if (!market) {
    return null;
  }

  return (
    <Flex height="100vh" maxHeight="100vh" flexDirection="column">
      <Header isSpot />
      <Flex flex="1" minHeight="0" overflow="hidden">
        <Flex
          borderRight="1px solid rgba(255,255,255,0.2)"
          flex="2"
          height="100%"
          flexDirection="column"
        >
          <Box
            display="block"
            borderBottom="1px solid rgba(255,255,255,0.2)"
            p="4"
          >
            <Heading display="inline-block" size="md">
              {market.synth} Spot Market
            </Heading>
            <Box float="right" display="none">
              <ArrowUpDownIcon />
            </Box>
          </Box>
          <SpotMarketForm id={market.marketId} />
          <Box flex="1" overflowY="auto" p="4">
            <MarketDetails marketId={market.marketId} />
          </Box>
        </Flex>

        <Box flex="5" pb="32px">
          <Flex direction="column" height="100%" width="100%">
            <AdvancedRealTimeChart
              theme="dark"
              autosize
              symbol={"PYTH:ETHUSD"}
            ></AdvancedRealTimeChart>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
