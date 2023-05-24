import { useAccount } from "wagmi";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { useSearchParams } from "react-router-dom";
import { useCreateAccount } from "../../hooks/useCreateAccount";
import { useGetAccounts } from "../../hooks/useGetAccounts";
import { useEffect } from "react";

export function AccountSwitcher() {
  const { isConnected } = useAccount();

  const [searchParams, setSelectedAccountId] = useSearchParams();
  const selectedAccountId = searchParams.get("accountId");

  const { accountIds, refetch } = useGetAccounts();
  const { createAccount } = useCreateAccount((accountId) => {
    setSelectedAccountId({ accountId });
    refetch();
  });

  useEffect(() => {
    if (!selectedAccountId && accountIds.length > 0) {
      setSelectedAccountId({ accountId: accountIds[0]?.toString() || "" });
      refetch();
    }
  }, [selectedAccountId, accountIds]);

  if (!isConnected) {
    return null;
  }

  return accountIds?.length || selectedAccountId ? (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <>Account #{selectedAccountId}</>
      </MenuButton>
      <MenuList>
        {accountIds?.map((accountId) => (
          <MenuItem
            key={accountId as string}
            onClick={() =>
              setSelectedAccountId({ accountId: accountId as string })
            }
          >
            <>Account #{(accountId as string)?.toString()}</>
          </MenuItem>
        ))}
        <MenuItem onClick={() => createAccount()}>Create New Account</MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Button colorScheme="cyan" onClick={() => createAccount()}>
      Create Account
    </Button>
  );
}
