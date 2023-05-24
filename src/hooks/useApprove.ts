import { BigNumber, BigNumberish, ethers } from "ethers";
import { useCallback, useMemo } from "react";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";

export const useApprove = (
  contractAddress: string,
  amount: BigNumberish,
  spender: string,
) => {
  const { address: accountAddress } = useAccount();
  const { chain: activeChain } = useNetwork();
  const hasWalletConnected = Boolean(activeChain);

  const { writeAsync, isLoading } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress as `0x${string}`,
    abi: erc20ABI,
    functionName: "approve",
    args: [spender as `0x${string}`, BigNumber.from(amount)],
  });

  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: erc20ABI,
    functionName: "allowance",
    args: [accountAddress!, spender as `0x${string}`],
    enabled: hasWalletConnected && !!contractAddress,
  });

  const sufficientAllowance = useMemo(() => {
    return allowance && allowance.gte(amount);
  }, [allowance, amount]);

  const approve = useCallback(async () => {
    if (!sufficientAllowance && !!contractAddress) {
      const txReceipt = await writeAsync();
      await txReceipt.wait();
      refetchAllowance();
    }
  }, [refetchAllowance, sufficientAllowance, writeAsync, contractAddress]);

  return {
    isLoading,
    approve,
    refetchAllowance,
    requireApproval: !sufficientAllowance,
    allowance,
  };
};
