import { useAccount } from "wagmi";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { useSearchParams } from "react-router-dom";
import { useCreateAccount } from "../../hooks/useCreateAccount";
import { useEffect } from "react";
import { useAccounts } from "../../hooks/perps/useAccounts";

export function AccountSwitcher() {
  const { isConnected } = useAccount();

  const { accounts, refetch } = useAccounts();
  const [searchParams, setSelectedAccountId] = useSearchParams();
  const selectedAccountId = searchParams.get("accountId");

  const { createAccount } = useCreateAccount((accountId) => {
    setSelectedAccountId({ accountId });
    refetch();
  });

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId({ accountId: accounts[0].accountId || "" });
      refetch();
    }
  }, [selectedAccountId, accounts]);

  if (!isConnected) {
    return null;
  }

  return accounts?.length || selectedAccountId ? (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <>Account #{selectedAccountId}</>
      </MenuButton>
      <MenuList>
        {accounts?.map((account) => (
          <MenuItem
            key={account.accountId}
            onClick={() =>
              setSelectedAccountId({ accountId: account.accountId })
            }
          >
            <>Account #{account.accountId?.toString()}</>
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
