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
import { Order, OrderStatus } from "../../../../hooks/spot/useGetOrders";
import { CancelledOrderRow } from "./CancelledOrderRow";

interface Props {
  marketId: number;
  loading: boolean;
  orders: Order[];
}

export function CancelledOrders({ marketId, orders, loading }: Props) {
  const cancelledOrders = useMemo(
    () => orders.filter((order) => order.status === OrderStatus.Cancelled),
    [orders],
  );

  return (
    <Box>
      <TableContainer py={4}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Order</Th>
              <Th>Amount</Th>
              <Th>Cancel Time</Th>
              <Th>Settlement Info</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!loading &&
              cancelledOrders.map((order) => (
                <CancelledOrderRow
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
