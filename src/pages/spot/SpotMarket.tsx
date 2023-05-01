import { Box, Flex, Heading } from "@chakra-ui/react";
import { Header } from "../../components";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useSpotMarketInfo } from "../../hooks/spot/useSpotMarketInfo";
import { useParams } from "react-router-dom";
import { spotMarkets } from "../../constants/markets";
import { MarketDetails } from "../../components/SpotMarket/MarketDetails";
import { SpotMarketForm } from "../../components/SpotMarket/SpotMarketForm";

export function SpotMarket() {
  const { marketId } = useParams();
  const id = spotMarkets[marketId?.toUpperCase() || ""].marketId;
  const { synthAddress } = useSpotMarketInfo(id);

  if (!id || !synthAddress) {
    return null;
  }

  return (
    <Flex height="100vh" maxHeight="100vh" flexDirection="column">
      <>
        <Header isSpot />
        <Flex flex="1" height="100%" minHeight={0}>
          <Box
            borderRight="1px solid rgba(255,255,255,0.2)"
            flex="2"
            maxHeight="100%"
          >
            <Box borderBottom="1px solid rgba(255,255,255,0.2)" p="4">
              <Heading size="md">ETH (Market Switcher)</Heading>
            </Box>
            <SpotMarketForm id={id} />
            <MarketDetails id={id} />
          </Box>
          <Box flex="5" pb="32px">
            <Flex direction="column" height="100%" width="100%">
              <AdvancedRealTimeChart
                theme="dark"
                autosize
                symbol={"ETHUSD"}
              ></AdvancedRealTimeChart>
            </Flex>
          </Box>
        </Flex>
      </>
    </Flex>
  );
}
