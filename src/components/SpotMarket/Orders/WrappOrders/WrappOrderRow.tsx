import { Td, Tr } from "@chakra-ui/react";
import Wei from "@synthetixio/wei";
import dayjs from "dayjs";
import { formatUnits } from "ethers/lib/utils.js";
import {
  WrappOrder,
  WrappOrderType,
} from "../../../../hooks/spot/useGetWrappHistory";
import { Amount } from "../../../Amount";

interface Props {
  marketId: number;
  order: WrappOrder;
}

export function WrappOrderRow({ order }: Props) {
  return (
    <>
      <Tr>
        <Td>#{order.type}</Td>
        <Td>
          {formatUnits(order.amount || "0", "ether")}{" "}
          {order.type === WrappOrderType.UnWrapped ? "snxETH" : "ETH"}
        </Td>

        <Td>
          <Amount
            value={new Wei(formatUnits(order.wrapperFees || "0", "ether"))}
            suffix="snxUSD"
          />
        </Td>
        <Td>
          {dayjs(Number(order.timestamp) * 1000).format("YYYY/MM/DD - HH:mm")}
          <br />
          <br />
          Block: {order.block}
        </Td>
      </Tr>
    </>
  );
}
