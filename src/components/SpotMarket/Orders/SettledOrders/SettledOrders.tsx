import {
  Box,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { Order, OrderStatus } from "../../../../hooks/spot/useGetOrders";
import { SettledOrderRow } from "./SettledOrderRow";

interface Props {
  marketId: number;
  loading: boolean;
  orders: Order[];
}

export function SettledOrders({ marketId, loading, orders }: Props) {
  const { address } = useAccount();

  const settledOrders = useMemo(
    () => orders.filter((order) => order.status === OrderStatus.Settled),
    [orders, address],
  );

  return (
    <Box>
      <TableContainer py={4}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Order</Th>
              <Th>Amount (after fees)</Th>
              <Th>Fixed Fees</Th>
              <Th>Skew Fees</Th>
              <Th>Utilization Fees</Th>
              <Th>Externally Collected Fees</Th>
              <Th>Settled At</Th>
              <Th>Price</Th>
              <Th>Settlement Info</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!loading &&
              settledOrders.map((order) => (
                <SettledOrderRow
                  key={order.asyncOrderId}
                  order={order}
                  marketId={marketId}
                />
              ))}
          </Tbody>
        </Table>
        {loading && (
          <Stack mt={4} gap={2} width="full">
            <Skeleton height="40px" rounded="lg" />
            <Skeleton height="40px" rounded="lg" />
            <Skeleton height="40px" rounded="lg" />
            <Skeleton height="40px" rounded="lg" />
          </Stack>
        )}
      </TableContainer>
    </Box>
  );
}
