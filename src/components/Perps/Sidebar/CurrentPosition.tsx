import { Flex, Heading, Box, Badge, Text } from "@chakra-ui/react";
import { wei } from "@synthetixio/wei";
import { formatEther } from "ethers/lib/utils.js";
import { Amount } from "../../Amount";

interface Props {
  openPosition: any[];
}
export function CurrentPosition({ openPosition }: Props) {
  const [pnl, accruedFunding, size] = openPosition;

  if (Number(size?.toString() || "0") === 0) {
    return null;
  }

  return (
    <Box p="4" borderBottom="1px solid rgba(255,255,255,0.2)">
      <Flex align="center" mb="2">
        <Heading size="sm">Current Position</Heading>{" "}
        {Number(size?.toString() || "0") > 0 ? (
          <Badge ml="2" colorScheme="green" fontSize="sm" borderRadius="4px">
            Long
          </Badge>
        ) : (
          <Badge ml="2" colorScheme="red" fontSize="sm" borderRadius="4px">
            Short
          </Badge>
        )}
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
