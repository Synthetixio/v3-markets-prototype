import { useParams } from "react-router-dom";
import { spotMarkets } from "../constants/markets";
import { useDefaultNetwork } from "./useDefaultNetwork";

export const useMarketId = () => {
  const { marketId: marketSymbol } = useParams();
  const network = useDefaultNetwork();
  const markets = spotMarkets[network.id];

  if (!markets) {
    return null;
  }

  const market = markets[marketSymbol?.toUpperCase() || "ETH"];
  return market;
};
