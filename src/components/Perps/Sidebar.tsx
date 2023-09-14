import { Flex, Box, Alert, AlertIcon, Text } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { useContractRead } from "wagmi";
import { useActivePerpsMarket } from "../../hooks/perps/useActivePerpsMarket";
import { useContract } from "../../hooks/useContract";
import { AsyncOrderClaim, PerpsAsyncOrder } from "./AsyncOrderClaim";
import { MarketSwitcher } from "./MarketSwitcher";
import { AccountOverview, CurrentPosition, OrderForm } from "./Sidebar/index";
import { useMulticallRead } from "../../hooks/useMulticallRead";

export function Sidebar() {
  const [searchParams] = useSearchParams();
  const selectedAccountId = searchParams.get("accountId");

  const perpsMarket = useContract("PERPS_MARKET");
  const { market: perps } = useActivePerpsMarket();

  const { data: asyncOrderClaimData, refetch } = useContractRead({
    address: perpsMarket.address,
    abi: perpsMarket.abi,
    functionName: "getOrder",
    args: [selectedAccountId],
    enabled: !!selectedAccountId,
  });

  const asyncOrderClaim = asyncOrderClaimData as unknown as PerpsAsyncOrder;
  const hasAsyncOrderOrder =
    !!asyncOrderClaim && !asyncOrderClaim?.request?.sizeDelta?.isZero();

  const { data: openPosition, refetch: refetchOpenPosition } = useMulticallRead<
    any[]
  >(perpsMarket.contract, "getOpenPosition", [
    selectedAccountId,
    perps?.id.toString(),
  ]);

  return (
    <Flex
      direction="column"
      height="100%"
      borderLeft="1px solid rgba(255,255,255,0.2)"
    >
      <Flex flexDirection="column" height="100%">
        <Box>
          <Alert status="warning" fontSize="sm" minWidth="400px">
            <AlertIcon w="4" />
            <Box>
              This is an experimental prototype.{" "}
              <Text fontWeight="semibold" display="inline">
                Use with caution.
              </Text>
            </Box>
          </Alert>
          <MarketSwitcher />
          <AccountOverview />
          {selectedAccountId && openPosition && (
            <CurrentPosition openPosition={openPosition as any[]} />
          )}
        </Box>
        {hasAsyncOrderOrder && selectedAccountId && (
          <AsyncOrderClaim
            orderClaim={asyncOrderClaim}
            accountId={selectedAccountId}
            refetch={() => {
              refetchOpenPosition();
              refetch();
            }}
          />
        )}
        <OrderForm refetch={() => refetch()} />
      </Flex>
    </Flex>
  );
}
