import { useParams } from "react-router-dom";
import { spotMarkets } from "../../constants/markets";
import { useDefaultNetwork } from "../useDefaultNetwork";

export const useSpotMarketId = () => {
  const { marketId } = useParams();
  const network = useDefaultNetwork();
  const markets = spotMarkets[network.id];

  if (!markets) {
    return null;
  }

  const market = markets[marketId?.toUpperCase() || "ETH"];
  return market;
};
