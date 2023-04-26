import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  InputRightElement,
  Heading,
  Input,
  InputGroup,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  VStack,
  Code,
} from "@chakra-ui/react";
import { Header } from "../../components";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export function SpotMarket() {
  return (
    <Flex height="100vh" maxHeight="100vh" flexDirection="column">
      <Header isSpot />
      <Flex flex="1" height="100%" minHeight={0}>
        <Box flex="5" pb="32px">
          <Flex direction="column" height="100%" width="100%">
            <Flex flexDirection="column" height="100%">
              <Flex>
                <Heading size="md">ETH \/</Heading>

                <StatGroup display="flex" flex="1">
                  <Stat
                    flex="1"
                    p="2"
                    borderLeft="1px solid rgba(255,255,255,0.2)"
                    height="100%"
                  >
                    <StatLabel>Market Price</StatLabel>
                    <StatNumber
                      fontSize="lg"
                      fontFamily="mono"
                      fontWeight="thin"
                    >
                      $123,123
                    </StatNumber>
                  </Stat>
                  <Stat
                    flex="1"
                    p="2"
                    borderLeft="1px solid rgba(255,255,255,0.2)"
                    height="100%"
                  >
                    <StatLabel>snxETH Issued</StatLabel>
                    <StatNumber
                      fontSize="lg"
                      fontFamily="mono"
                      fontWeight="thin"
                    >
                      $1.3M
                    </StatNumber>
                  </Stat>
                  <Stat
                    flex="1"
                    p="2"
                    borderLeft="1px solid rgba(255,255,255,0.2)"
                    height="100%"
                  >
                    <StatLabel>snxUSD Issued</StatLabel>
                    <StatNumber
                      fontSize="lg"
                      fontFamily="mono"
                      fontWeight="thin"
                    >
                      $1.3M
                    </StatNumber>
                  </Stat>
                  <Stat
                    flex="1"
                    p="2"
                    borderLeft="1px solid rgba(255,255,255,0.2)"
                    height="100%"
                  >
                    <StatLabel>Market Collateralization</StatLabel>
                    <StatNumber
                      fontSize="lg"
                      fontFamily="mono"
                      fontWeight="thin"
                    >
                      $3.4M
                    </StatNumber>
                  </Stat>
                  <Stat
                    flex="1"
                    p="2"
                    borderLeft="1px solid rgba(255,255,255,0.2)"
                    height="100%"
                  >
                    <StatLabel>Market Credit Capacity</StatLabel>
                    <StatNumber
                      fontSize="lg"
                      fontFamily="mono"
                      fontWeight="thin"
                    >
                      $3.4M
                    </StatNumber>
                  </Stat>
                </StatGroup>
              </Flex>
              <AdvancedRealTimeChart
                theme="dark"
                autosize
                symbol={"ETHUSD"}
              ></AdvancedRealTimeChart>
            </Flex>
          </Flex>
        </Box>
        <Box
          borderLeft="1px solid rgba(255,255,255,0.2)"
          flex="2"
          maxHeight="100%"
        >
          <Box borderBottom="1px solid rgba(255,255,255,0.2)" p="4">
            <div key="form" style={{ width: "100%" }}>
              <VStack spacing={4} align="flex-start" w="100%">
                <FormLabel htmlFor="amount">Order Type</FormLabel>
                <Flex direction="row" width="100%" gap="4">
                  <Button
                    colorScheme={true ? "green" : "gray"}
                    width="100%"
                    mr="1"
                  >
                    Buy
                  </Button>
                  <Button
                    colorScheme={false ? "green" : "gray"}
                    width="100%"
                    mr="1"
                  >
                    Sell
                  </Button>
                  <Button
                    colorScheme={false ? "green" : "gray"}
                    width="100%"
                    mr="1"
                  >
                    Wrap
                  </Button>
                  <Button
                    colorScheme={false ? "gray" : "gray"}
                    width="100%"
                    ml="1"
                  >
                    Unwrap
                  </Button>
                </Flex>
                <FormControl key="amount">
                  <FormLabel htmlFor="amount">Amount</FormLabel>
                  <InputGroup>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      variant="filled"
                      value={""}
                    />
                    <InputRightElement width="6rem">snxUSD</InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>Slippage protection</FormControl>
                <FormControl>atomic / async selector</FormControl>
                <Button
                  key="button"
                  type="submit"
                  size="lg"
                  colorScheme={true ? "green" : "red"}
                  width="full"
                >
                  Submit
                </Button>
              </VStack>
            </div>
          </Box>
          <Box p="4">
            <Heading size="md" mb="3">
              Market Details
            </Heading>
            <Box mb="2">
              <Heading size="xs">Utilization</Heading>
              0% (of X)
            </Box>
            <Box mb="2">
              <Heading size="xs">Skew</Heading>
              -100 ETH (targetting 100ETH)
            </Box>
            <Box mb="2">
              <Heading size="xs">Atomic Fixed Fee</Heading>
              0%
            </Box>
            <Box mb="2">
              <Heading size="xs">Direct Integrations</Heading>
            </Box>
            <Box mb="2">
              <Heading size="xs">Async Fixed Fee</Heading>
              0%
            </Box>
            <Box mb="2">
              <Heading size="xs">Interest Rate</Heading>
              0%
            </Box>
            <Box mb="2">
              <Heading size="xs">Custom Fee Collector</Heading>
              <Code>0x0000...</Code>
            </Box>
            <Box mb="2">
              <Heading size="xs">Referrers</Heading>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}