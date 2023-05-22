import { RepeatIcon } from "@chakra-ui/icons";
import { TabList, Tab, Tabs, Box, Checkbox, Flex } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { OrderStatus, useGetOrders } from "../../../hooks/spot/useGetOrders";
import { CancelledOrders } from "../Orders/CancelledOrders";
import { CommitedOrders } from "../Orders/CommitedOrders";
import { SettledOrders } from "../Orders/SettledOrders";

interface Props {
  marketId: number;
  defaultIndex?: number;
}

export function AsyncOrders({ marketId, defaultIndex }: Props) {
  const [showAll, setShowAll] = useState(true);
  const tabs = [
    OrderStatus.Settled,
    OrderStatus.Cancelled,
    OrderStatus.Commited,
  ];
  const [tabIndex, setTabIndex] = useState(defaultIndex ?? 0);
  const orderStatus = tabs[tabIndex];

  const { refetch, orders, loading } = useGetOrders(marketId, showAll);

  return (
    <>
      <Box>
        <Tabs defaultIndex={tabIndex} position="relative">
          <TabList>
            {tabs.map((tab, i) => (
              <Tab key={tab} onClick={() => setTabIndex(i)}>
                {tab}
              </Tab>
            ))}
          </TabList>
          <Flex
            alignItems="center"
            gap={4}
            position="absolute"
            right="4"
            top="0"
          >
            <RepeatIcon
              onClick={() => refetch()}
              cursor="pointer"
              fontSize="xl"
            />

            <Checkbox
              onChange={(e) => setShowAll(!e.target.checked)}
              checked={!showAll}
            >
              My Orders
            </Checkbox>
          </Flex>
        </Tabs>
      </Box>

      {orderStatus === OrderStatus.Settled && (
        <SettledOrders marketId={marketId} orders={orders} loading={loading} />
      )}

      {orderStatus === OrderStatus.Cancelled && (
        <CancelledOrders
          marketId={marketId}
          orders={orders}
          loading={loading}
        />
      )}

      {orderStatus === OrderStatus.Commited && (
        <CommitedOrders
          marketId={marketId}
          orders={orders}
          loading={loading}
          refetch={refetch}
        />
      )}
    </>
  );
}
