import { FeeData } from "@ethersproject/abstract-provider";
import { wei } from "@synthetixio/wei";

export const GWEI_DECIMALS = 9;

export const getTotalGasPrice = (gasPriceObj?: FeeData | null) => {
  if (!gasPriceObj) return wei(0);
  const { gasPrice, lastBaseFeePerGas, maxPriorityFeePerGas, maxFeePerGas } =
    gasPriceObj;
  if (gasPrice) {
    return wei(gasPrice, GWEI_DECIMALS);
  }
  return wei(lastBaseFeePerGas || 0, GWEI_DECIMALS).add(
    wei(maxPriorityFeePerGas || 0, GWEI_DECIMALS),
  );
};
