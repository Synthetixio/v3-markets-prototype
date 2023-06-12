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
import { WrappOrder } from "../../../../hooks/spot/useGetWrappHistory";
import { WrappOrderRow } from "./WrappOrderRow";

interface Props {
  marketId: number;
  loading: boolean;
  orders: WrappOrder[];
}

export function WrappOrders({ marketId, orders, loading }: Props) {
  return (
    <Box>
      <TableContainer py={4}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>Amount</Th>
              <Th>Fee</Th>
              <Th>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!loading &&
              orders.map((order) => (
                <WrappOrderRow
                  key={order.block + order.amount}
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
