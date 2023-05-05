import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Header } from "../../components";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useSpotMarketInfo } from "../../hooks/spot/useSpotMarketInfo";
import { useParams } from "react-router-dom";
import { spotMarkets } from "../../constants/markets";
import { MarketDetails } from "../../components/SpotMarket/MarketDetails";
import { SpotMarketForm } from "../../components/SpotMarket/SpotMarketForm";
import { ArrowUpDownIcon } from "@chakra-ui/icons";

export function SpotMarket() {
  const { marketId } = useParams();
  const id = spotMarkets[marketId?.toUpperCase() || "ETH"].marketId;
  const { synthAddress } = useSpotMarketInfo(id);

  if (!id || !synthAddress) {
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
              snxETH Spot Market
            </Heading>
            <Text opacity="0.5" display="inline-block" ml="1.5">
              (ID {id})
            </Text>
            <Box float="right">
              <ArrowUpDownIcon />
            </Box>
          </Box>
          <SpotMarketForm id={id} />

          <Box flex="1" overflowY="auto" p="4">
            <MarketDetails id={id} />
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
