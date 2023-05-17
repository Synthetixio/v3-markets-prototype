import {
  Box,
  Checkbox,
  Flex,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { OrderStatus, useGetOrders } from "../../../hooks/spot/useGetOrders";
import { SettledOrderRow } from "./SettledOrderRow";

interface Props {
  marketId: number;
}

export function SettledOrders({ marketId }: Props) {
  const [showAll, setShowAll] = useState(true);
  const { orders } = useGetOrders(marketId, showAll);
  const { address } = useAccount();
  const [orderStatus, setOrderStatus] = useState(OrderStatus.Settled);

  const settledOrders = useMemo(
    () => orders.filter((order) => order.status === orderStatus),
    [orders, address, orderStatus],
  );

  return (
    <Box>
      <Tabs position="relative">
        <TabList>
          <Tab onClick={() => setOrderStatus(OrderStatus.Settled)}>
            {OrderStatus.Settled}
          </Tab>
          <Tab onClick={() => setOrderStatus(OrderStatus.Cancelled)}>
            {OrderStatus.Cancelled}
          </Tab>
          <Tab onClick={() => setOrderStatus(OrderStatus.Commited)}>
            {OrderStatus.Commited}
          </Tab>
        </TabList>
        <Checkbox
          onChange={(e) => setShowAll(!e.target.checked)}
          checked={!showAll}
          position="absolute"
          right="0"
          top="0"
        >
          My Orders
        </Checkbox>
      </Tabs>
      <TableContainer py={4}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Order</Th>
              <Th>Amount (after fees)</Th>
              <Th>Fixed Fees</Th>
              <Th>Skew Fees</Th>
              <Th>Wrapper Fees</Th>
              <Th>Utilization Fees</Th>
              <Th>Externally Collected Fees</Th>
              <Th>Settlement Info</Th>
            </Tr>
          </Thead>
          <Tbody>
            {settledOrders.map((order) => (
              <SettledOrderRow
                key={order.asyncOrderId}
                order={order}
                marketId={marketId}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}