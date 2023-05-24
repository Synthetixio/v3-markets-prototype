import { Heading, Box } from "@chakra-ui/react";
import { ArrowUpDownIcon } from "@chakra-ui/icons";

export function MarketSwitcher() {
  return (
    <>
      <Box display="block" borderBottom="1px solid rgba(255,255,255,0.2)" p="4">
        <Heading display="inline-block" size="md">
          ETH Perps Market
        </Heading>
        <Box float="right" display="none">
          <ArrowUpDownIcon />
        </Box>
      </Box>
    </>
  );
}
