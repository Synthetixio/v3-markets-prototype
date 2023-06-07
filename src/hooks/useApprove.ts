import { BigNumber, BigNumberish, Contract, ethers } from "ethers";
import { useCallback, useMemo } from "react";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useNetwork,
  useSigner,
} from "wagmi";
import { useTransact } from "./useTransact";

export const useApprove = (
  contractAddress: string,
  amount: BigNumberish,
  spender: string,
) => {
  const { transact, isLoading } = useTransact();
  const { data: signer } = useSigner();
  const { address: accountAddress } = useAccount();
  const { chain: activeChain } = useNetwork();
  const hasWalletConnected = Boolean(activeChain);

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
    if (!sufficientAllowance && !!contractAddress && !!signer) {
      const contract = new Contract(contractAddress, erc20ABI, signer);
      await transact(contract, "approve", [spender, BigNumber.from(amount)]);
      refetchAllowance();
    }
  }, [
    refetchAllowance,
    sufficientAllowance,
    contractAddress,
    signer,
    spender,
    amount,
    transact,
  ]);

  return {
    isLoading,
    approve,
    refetchAllowance,
    requireApproval: !sufficientAllowance,
    allowance,
  };
};
