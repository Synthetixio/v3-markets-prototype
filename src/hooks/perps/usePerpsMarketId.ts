import { useParams } from "react-router-dom";
import { perpsMarkets, spotMarkets } from "../../constants/markets";
import { useDefaultNetwork } from "../useDefaultNetwork";

export const usePerpsMarketId = () => {
  const { marketId: marketSymbol } = useParams();
  const network = useDefaultNetwork();
  const markets = perpsMarkets[network.id];

  if (!markets) {
    return null;
  }

  const market = markets[marketSymbol?.toUpperCase() || "ETH"];
  return market;
};
