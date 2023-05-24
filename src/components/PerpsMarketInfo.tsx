import { Flex } from "@chakra-ui/react";
import { PriceChart } from "./Market/index";

export function PerpsMarketInfo() {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex flexDirection="column" height="100%">
        <PriceChart />
      </Flex>
    </Flex>
  );
}
