import { useToast } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useContractWrite } from "wagmi";
import { FeeType } from "../../constants/order";
import { useContract } from "../useContract";

export const useSetFee = (
  marketId: string | number,
  val: number | string,
  type: FeeType,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const spotMarket = useContract("SPOT_MARKET");

  const fnName = useMemo(() => {
    switch (type) {
      case FeeType.FIXED:
        return "setAtomicFixedFee";
      case FeeType.UTILIZATION:
        return "setMarketUtilizationFees";
      case FeeType.SKEW_SCALE:
        return "setMarketSkewScale";
      case FeeType.ASYNC_FIXED:
        return "setAsyncFixedFee";
    }
  }, []);

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: spotMarket.address,
    abi: spotMarket.abi,
    functionName: fnName,
  });
  const toast = useToast({
    isClosable: true,
    duration: 9000,
  });

  const submit = useCallback(async () => {
    setIsLoading(true);
    try {
      const txReceipt = await writeAsync({
        recklesslySetUnpreparedArgs: [marketId, val],
      });
      await txReceipt.wait();
      toast({
        title: "Successfully done",
        status: "success",
        isClosable: true,
        duration: 9000,
      });
    } catch (error) {
      console.log("error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [writeAsync, val, marketId]);

  return {
    submit,
    isLoading,
  };
};
