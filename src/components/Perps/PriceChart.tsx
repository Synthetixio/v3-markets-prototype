import { Box } from "@chakra-ui/react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useParams } from "react-router-dom";

export function PriceChart() {
  const { marketSymbol } = useParams();
  const id = marketSymbol?.toUpperCase();

  if (!id) {
    return null;
  }

  return (
    <Box height="100%">
      <AdvancedRealTimeChart
        theme="dark"
        autosize
        symbol={`PYTH:${marketSymbol?.toUpperCase()}USD`}
      ></AdvancedRealTimeChart>
    </Box>
  );
}
