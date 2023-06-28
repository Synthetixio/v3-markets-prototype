import {
  Flex,
  Heading,
  Box,
  Badge,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { wei } from "@synthetixio/wei";
import { formatEther } from "ethers/lib/utils.js";
import { useContractRead } from "wagmi";
import { usePerpsMarketId } from "../../../hooks/perps/usePerpsMarketId";
import { useContract } from "../../../hooks/useContract";
import { Amount } from "../../Amount";

interface Props {
  accountId: string;
}
export function CurrentPosition({ accountId }: Props) {
  const perpsMarket = useContract("PERPS_MARKET");
  const perps = usePerpsMarketId();

  const { data: openPosition, isLoading } = useContractRead({
    address: perpsMarket.address,
    abi: perpsMarket.abi,
    functionName: "getOpenPosition",
    args: [accountId, perps?.marketId],
  });

  if (isLoading || !openPosition) {
    return null;
  }

  const [pnl, accruedFunding, size] = openPosition;

  if (Number(size?.toString() || "0") === 0) {
    return null;
  }

  return (
    <Box p="4" borderBottom="1px solid rgba(255,255,255,0.2)">
      <Alert status="error" fontSize="sm" w="100%" mb="4">
        <AlertIcon w="4" />
        <Box>
          <Text fontWeight="bold" display="inline">
            This UI is under construction.
          </Text>
        </Box>
      </Alert>

      <Flex align="center" mb="2">
        <Heading size="sm">Current Position</Heading>{" "}
        <Badge ml="2" colorScheme="green" fontSize="sm" borderRadius="4px">
          Long
        </Badge>
      </Flex>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        Size
        <Text display="inline" fontFamily="mono">
          <Amount value={wei(formatEther(size?.toString() || "0"))} />
        </Text>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        Accrued Funding
        <Text display="inline" fontFamily="mono">
          <Amount value={wei(formatEther(accruedFunding?.toString() || "0"))} />
        </Text>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        Profit/Loss
        <Text display="inline" fontFamily="mono">
          <Amount
            value={wei(formatEther(pnl?.toString() || "0"))}
            suffix="USD"
          />
        </Text>
      </Box>
    </Box>
  );
}
