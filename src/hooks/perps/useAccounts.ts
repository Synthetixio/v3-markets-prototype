import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import { perpsClient } from "../../utils/clients";

const GET_ACCOUNTS = gql`
  query GetAccounts($owner: String) {
    accounts(where: { owner_contains: $owner }) {
      id
      accountId
      owner
    }
  }
`;

export interface Account {
  id: string;
  accountId: string;
  owner: string;
}

export const useAccounts = () => {
  const { address } = useAccount();

  const { loading, data, refetch } = useQuery(GET_ACCOUNTS, {
    variables: {
      owner: address?.toLowerCase(),
    },
    client: perpsClient,
    notifyOnNetworkStatusChange: true,
  });

  const accounts = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.accounts as Account[];
  }, [data]);

  return {
    accounts,
    isLoading: loading,
    refetch,
  };
};
