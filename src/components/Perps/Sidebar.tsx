import { Flex, Box } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { useContractRead } from "wagmi";
import { usePerpsMarketId } from "../../hooks/perps/usePerpsMarketId";
import { useContract } from "../../hooks/useContract";
import { AsyncOrderClaim, PerpsAsyncOrder } from "./AsyncOrderClaim";
import { MarketSwitcher } from "./MarketSwitcher";
import { AccountOverview, CurrentPosition, OrderForm } from "./Sidebar/index";

export function Sidebar() {
  const [searchParams] = useSearchParams();
  const selectedAccountId = searchParams.get("accountId");

  const perpsMarket = useContract("PERPS_MARKET");
  const perps = usePerpsMarketId();

  const { data: asyncOrderClaimData, refetch } = useContractRead({
    address: perpsMarket.address,
    abi: perpsMarket.abi,
    functionName: "getAsyncOrderClaim",
    args: [selectedAccountId, perps?.marketId],
    enabled: !!selectedAccountId,
  });
  const asyncOrderClaim = asyncOrderClaimData as unknown as PerpsAsyncOrder;
  const hasAsyncOrderOrder =
    !!asyncOrderClaim && asyncOrderClaim.sizeDelta.gt(0);

  return (
    <Flex
      direction="column"
      height="100%"
      borderLeft="1px solid rgba(255,255,255,0.2)"
    >
      <Flex flexDirection="column" height="100%">
        <Box>
          <MarketSwitcher />
          <AccountOverview />
          {selectedAccountId && (
            <CurrentPosition accountId={selectedAccountId} />
          )}
        </Box>
        {hasAsyncOrderOrder && selectedAccountId && (
          <AsyncOrderClaim
            orderClaim={asyncOrderClaim}
            accountId={selectedAccountId}
          />
        )}
        {!hasAsyncOrderOrder && <OrderForm refetch={() => refetch()} />}
      </Flex>
    </Flex>
  );
}
