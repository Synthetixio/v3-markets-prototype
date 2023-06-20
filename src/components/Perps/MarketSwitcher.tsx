import { Heading, Box } from "@chakra-ui/react";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { usePerpsMarketId } from "../../hooks/perps/usePerpsMarketId";
import { useMarkets } from "../../hooks/perps/useMarkets";

export function MarketSwitcher() {
  const marketInfo = usePerpsMarketId();
  const { market } = useMarkets(marketInfo?.marketId);

  return (
    <>
      <Box display="block" borderBottom="1px solid rgba(255,255,255,0.2)" p="4">
        <Heading display="inline-block" size="md">
          {market?.marketName} Perps Market
        </Heading>
        <Box float="right" display="none">
          <ArrowUpDownIcon />
        </Box>
      </Box>
    </>
  );
}
