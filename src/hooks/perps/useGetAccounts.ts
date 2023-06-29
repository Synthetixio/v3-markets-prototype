import { useAccount, useContractRead, useContractReads } from "wagmi";
import { useContract } from "../useContract";

export const useGetAccounts = () => {
  const { address, isConnected } = useAccount();
  const accountProxy = useContract("PERPS_ACCOUNT_PROXY");

  const {
    data: acccountCount,
    isLoading: acccountCountisLoading,
    refetch,
  } = useContractRead({
    address: accountProxy?.address,
    abi: accountProxy?.abi,
    functionName: "balanceOf",
    args: [address || "0x"],
    enabled: isConnected && !!address && !!accountProxy,
  });

  const { data: accountIds, isLoading: accountIdsIsLoading } = useContractReads(
    {
      enabled: Boolean(!acccountCountisLoading && !!acccountCount),
      contracts:
        Number(acccountCount) > 0
          ? Array.from(Array(Number(acccountCount?.toString())).keys())?.map(
              (index) => {
                return {
                  address: accountProxy?.address,
                  abi: accountProxy?.abi,
                  functionName: "tokenOfOwnerByIndex",
                  args: [address, index],
                };
              },
            )
          : [],
    },
  );

  return {
    acccountCount,
    accounts: (accountIds || []).map((item) => ({
      owner: address?.toString()!,
      accountId: item.toString(),
      id: item.toString(),
    })),
    isLoading: accountIdsIsLoading || acccountCountisLoading,
    refetch,
  };
};
