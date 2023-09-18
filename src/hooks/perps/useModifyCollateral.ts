import { parseEther } from "ethers/lib/utils.js";
import { useCallback, useMemo, useState } from "react";
import { useApprove } from "../useApprove";
import { useContract } from "../useContract";
import { useTransact } from "../useTransact";

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
  const { transact } = useTransact();

  const submit = useCallback(
    async (isDeposit: boolean) => {
      try {
        setIsLoading(true);

        if (isDeposit) {
          await approve();
        }

        const args = [
          accountId,
          marketId,
          isDeposit ? amountD18 : `-${Number(amountD18).toString()}`,
        ];

        // await perpsProxy.contract.callStatic.modifyCollateral(...args);

        // const tx = await perpsProxy.contract.modifyCollateral(...args);

        await transact(perpsProxy.contract, "modifyCollateral", args);

        // await tx.wait();
        onSuccess();
      } catch (error: any) {
        if (error.errorName) {
          console.log(error.errorName);
        } else {
          console.log("error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      accountId,
      marketId,
      amountD18,
      transact,
      perpsProxy.contract,
      onSuccess,
      approve,
    ],
  );

  return {
    isLoading,
    submit,
  };
};
