import { BigNumberish, Contract } from "ethers";
import { useProvider, useAccount, useQuery } from "wagmi";
import { readMulticall } from "../utils/readMulticall";

export const useMulticallRead = <T = any>(
  contract: Contract,
  fn: string,
  args: Array<any>,
  value?: BigNumberish | undefined,
): {
  data: T | undefined;
  isLoading: boolean;
  refetch: () => void;
} => {
  const provider = useProvider();
  const account = useAccount();

  const { data, isLoading, refetch } = useQuery(
    [contract.address, fn, args, value],
    async () => {
      return (await readMulticall(
        contract,
        fn,
        args,
        provider,
        account.address,
        value,
      )) as T;
    },
    {
      enabled: !!contract && !!fn && !!provider,
      staleTime: 50,
    },
  );

  return {
    data,
    isLoading,
    refetch,
  };
};
