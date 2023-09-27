import { Heading, Box, Tag, Flex } from "@chakra-ui/react";
import { useMarkets } from "../../hooks/perps/useMarkets";
import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";

export function MarketSwitcher() {
  const { marketSymbol } = useParams();
  const { market, markets } = useMarkets(marketSymbol);

  const filteredMarkets = useMemo(
    () => markets.filter((item) => item.id !== market?.id),
    [market?.id, markets],
  );

  return (
    <>
      <Box display="block" borderBottom="1px solid rgba(255,255,255,0.2)" p="4">
        <Heading display="inline-block" size="md">
          {market?.marketName} Perps Market
        </Heading>
        {filteredMarkets.length > 0 && (
          <Flex mt={3} gap={2} alignItems="center">
            {filteredMarkets.map((item) => (
              <Link key={item.id} to={"/perps/markets/" + item.marketSymbol}>
                <Tag size="sm" variant="solid" colorScheme="teal">
                  {item.marketSymbol}
                </Tag>
              </Link>
            ))}
          </Flex>
        )}
      </Box>
    </>
  );
}
