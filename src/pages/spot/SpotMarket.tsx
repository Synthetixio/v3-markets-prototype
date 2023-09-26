import { Box, Flex, Heading } from "@chakra-ui/react";
import { Header } from "../../components";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { MarketDetails } from "../../components/SpotMarket/MarketDetails";
import { SpotMarketForm } from "../../components/SpotMarket/SpotMarketForm";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { useSpotMarketId } from "../../hooks/spot/useSpotMarketId";
import { useContractRead } from "wagmi";
import { useContract } from "../../hooks/useContract";

export function SpotMarket() {
  const market = useSpotMarketId();
  const spotMarketProxy = useContract("SPOT_MARKET");

  const { data: marketName } = useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "name",
    args: [market?.marketId],
    enabled: !!market?.marketId,
  });

  if (!market) {
    return <p>No markets found</p>;
  }

  return (
    <Flex height="100vh" maxHeight="100vh" flexDirection="column">
      <Header />
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
              {marketName?.toString()}
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
