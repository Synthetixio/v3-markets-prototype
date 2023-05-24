import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Box,
  Badge,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

export function CurrentPosition() {
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
      {/* before and after */}
      <Box mb="1">
        Size
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            1 ETH ($X)
          </Text>{" "}
          <ArrowForwardIcon mt="-1" />{" "}
          <Text display="inline" fontFamily="mono">
            1 ETH ($X)
          </Text>
        </Box>
      </Box>
      <Box>
        Profit/Loss
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            $0
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
