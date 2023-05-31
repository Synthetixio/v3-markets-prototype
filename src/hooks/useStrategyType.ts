import { StrategyType } from "../constants/order";
import { useChainId } from "./useDefaultNetwork";

export const useStrategyType = () => {
  const chainId = useChainId();

  if (!(chainId in StrategyType)) {
    throw new Error(`StrategyType for chainId "${chainId}" not found`);
  }

  return StrategyType[chainId as keyof typeof StrategyType];
};
