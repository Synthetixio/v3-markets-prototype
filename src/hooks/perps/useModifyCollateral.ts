import { parseEther } from "ethers/lib/utils.js";
import { useCallback, useMemo, useState } from "react";
import { useApprove } from "../useApprove";
import { useContract } from "../useContract";

export const useModifyCollateral = (
  marketId: number,
  accountId: string,
  amount: string,
  synth: string,
  onSuccess: () => void,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const perpsProxy = useContract("PERPS_MARKET");

  const amountD18 = useMemo(
    () => parseEther(amount || "0").toString(),
    [amount],
  );
  const { approve } = useApprove(synth, amountD18, perpsProxy.address);

  const submit = useCallback(
    async (isDeposit: boolean) => {
      try {
        setIsLoading(true);
        await approve();

        const tx = await perpsProxy.contract.modifyCollateral(
          accountId,
          2, //snxETH
          isDeposit ? amountD18 : `-${Number(amountD18).toString()}`,
        );

        await tx.wait();
        onSuccess();
      } catch (error) {
        console.log("error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [marketId, accountId, perpsProxy, approve],
  );

  return {
    isLoading,
    submit,
  };
};
