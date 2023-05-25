import { useParams } from "react-router-dom";
import { useNetwork } from "wagmi";
import { spotMarkets } from "../constants/markets";

export const useMarketId = () => {
  const { marketId: marketSymbol } = useParams();
  const { chain } = useNetwork();

  const markets = spotMarkets[chain?.id || 420];
  if (!markets) {
    return null;
  }

  const market = markets[marketSymbol?.toUpperCase() || "ETH"];
  return market;
};
