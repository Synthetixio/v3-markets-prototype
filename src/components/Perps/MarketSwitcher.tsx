import { Heading, Box } from "@chakra-ui/react";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { useMarkets } from "../../hooks/perps/useMarkets";
import { useParams } from "react-router-dom";

export function MarketSwitcher() {
  const { marketSymbol } = useParams();
  const { market } = useMarkets(marketSymbol);

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
