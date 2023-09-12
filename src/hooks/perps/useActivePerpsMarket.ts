import { useParams } from "react-router-dom";
import { useMarkets } from "./useMarkets";

export const useActivePerpsMarket = () => {
  const { marketSymbol } = useParams();
  const { market, isLoading } = useMarkets(marketSymbol);

  return { market, isLoading };
};
