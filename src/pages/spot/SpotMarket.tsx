import { Box, Flex, Heading, Tag } from "@chakra-ui/react";
import { Header } from "../../components";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { MarketDetails } from "../../components/SpotMarket/MarketDetails";
import { SpotMarketForm } from "../../components/SpotMarket/SpotMarketForm";
import { useSpotMarketId } from "../../hooks/spot/useSpotMarketId";
import { useContractRead, useNetwork } from "wagmi";
import { useContract } from "../../hooks/useContract";
import { Link, useParams } from "react-router-dom";
import { useDefaultNetwork } from "../../hooks/useDefaultNetwork";
import { spotMarkets } from "../../constants/markets";
import { useMemo } from "react";

export function SpotMarket() {
  const { chain } = useNetwork();
  const { marketId } = useParams();
  const market = useSpotMarketId();
  const spotMarketProxy = useContract("SPOT_MARKET");

  const network = useDefaultNetwork();
  const markets = useMemo(
    () =>
      Object.entries(spotMarkets[network.id] || {})
        .map(([key, item]) => ({ ...item, key }))
        .filter(
          (item) => item.key.toString() !== (marketId?.toUpperCase() || "ETH"),
        ),
    [marketId, network.id],
  );

  const { data: marketName } = useContractRead({
    address: spotMarketProxy.address,
    abi: spotMarketProxy.abi,
    functionName: "name",
    args: [market?.marketId],
    enabled: !!market?.marketId,
  });

  if (!market) {
    return (
      <Flex height="100vh" maxHeight="100vh" flexDirection="column">
        <Header />
        <Flex p={10}>
          <p>
            {marketId} spot market is not availble on {chain?.name}
          </p>
        </Flex>
      </Flex>
    );
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
            {markets.length > 0 && (
              <Flex mt={3} gap={2} alignItems="center">
                {markets.map((item) => (
                  <Link key={item.marketId} to={"/spot/markets/" + item.key}>
                    <Tag size="sm" variant="solid" colorScheme="teal">
                      {item.key}
                    </Tag>
                  </Link>
                ))}
              </Flex>
            )}
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
              symbol={market?.tradingViewSymbol || "PYTH:ETHUSD"}
            ></AdvancedRealTimeChart>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
