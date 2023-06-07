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
import { useGetBlock } from "../../../../hooks/useGetBlock";
import { CommitedOrderRow } from "./CommitedOrderRow";

interface Props {
  marketId: number;
  loading: boolean;
  orders: Order[];
  refetch: () => void;
}

export function CommitedOrders({ marketId, orders, loading, refetch }: Props) {
  const { address } = useAccount();

  const commitedOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status === OrderStatus.Commited &&
          Number(order.settledAt) === 0,
      ),
    [orders, address],
  );

  const { timestamp } = useGetBlock();

  return (
    <Box>
      <TableContainer py={4}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Order</Th>
              <Th>Amount</Th>
              <Th>Settlement Info</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!loading &&
              commitedOrders.map((order) => (
                <CommitedOrderRow
                  key={order.asyncOrderId}
                  order={order}
                  marketId={marketId}
                  refetch={() => refetch()}
                  block={timestamp}
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
