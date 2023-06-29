import { gql, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
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
  const [newAccounts, setNewAccounts] = useState<Account[]>([]);

  const { loading, data, refetch } = useQuery(GET_ACCOUNTS, {
    variables: {
      owner: address?.toLowerCase(),
    },
    client: perpsClient,
    notifyOnNetworkStatusChange: true,
  });

  const accounts = useMemo(() => {
    if (!data) {
      return [...newAccounts];
    }
    const list = [...data.accounts, ...newAccounts];

    let uniqueList: Account[] = [];
    list.forEach((account) => {
      if (!uniqueList.find((i) => i.accountId == account.accountId)) {
        uniqueList.push(account);
      }
    });

    return uniqueList;
  }, [data]);

  return {
    accounts,
    addNewAccount: (account: Account) =>
      setNewAccounts((list) => {
        const newList = [...list];
        newList.push(account);
        return newList;
      }),
    isLoading: loading,
    refetch,
  };
};
