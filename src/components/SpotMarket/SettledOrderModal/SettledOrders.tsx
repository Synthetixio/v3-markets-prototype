import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useGetSettledOrders } from "../../../hooks/spot/useGetSettledOrders";
import { SettledOrderRow } from "./SettledOrder";

interface Props {
  onClose: () => void;
  marketId: number;
}

export function SettledOrders({ onClose, marketId }: Props) {
  const { settledOrders } = useGetSettledOrders();
  return (
    <TableContainer>
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
  );
}
