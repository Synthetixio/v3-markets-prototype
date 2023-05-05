import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { parseEther } from "ethers/lib/utils.js";
import { useMemo, useState } from "react";
import { useAccount, useBalance, useToken } from "wagmi";
import { contracts } from "../../constants/contracts";
import { OrderType } from "../../constants/order";
import {
  useSpotMarketInfo,
  useSpotMarketStat,
} from "../../hooks/spot/useSpotMarketInfo";
import { useSpotMarketBuy } from "../../hooks/spot/useSpotMarketOrder";
import { useContract } from "../../hooks/useContract";
import { SlippageSelector } from "../SlippageSelector";

export function SpotMarketForm({ id }: { id: number }) {
  const { synthAddress, marketName } = useSpotMarketInfo(id);
  const { reportedDebt, withdrawableMarketUsd } = useSpotMarketStat(id);
  const { data: tokenInfo } = useToken({
    address: synthAddress as `0x${string}`,
  });
  const [slippage, setSlippage] = useState(1);
  const [amount, setAmount] = useState("0");
  const [settlementType, setSettlementType] = useState("async");
  const [strategyType, setStrategyType] = useState("1");

  const { address } = useAccount();

  const USD = useContract("USD");
  const { data } = useBalance({
    address,
    token: USD.address as `0x${string}`,
  });

  const usdAmount = useMemo(() => parseEther(amount).toString(), [amount]);
  const { buyAtomic, buyAsync, isLoading } = useSpotMarketBuy(
    id,
    usdAmount,
    slippage,
  );

  const [orderType, setOrderType] = useState(OrderType.BUY);

  let inputToken = "snxUSD";
  let outputToken = "snxETH";
  if (orderType === OrderType.SELL) {
    inputToken = "snxETH";
    outputToken = "snxUSD";
  } else if (orderType === OrderType.UNWRAP) {
    inputToken = "snxETH";
    outputToken = "ETH";
  } else if (orderType === OrderType.WRAP) {
    inputToken = "ETH";
    outputToken = "snxETH";
  }

  const submit = () => {
    if (settlementType === "async") {
      buyAsync(Number(strategyType));
    } else if (settlementType === "atomic") {
      buyAtomic();
    }
  };
  return (
    <Box borderBottom="1px solid rgba(255,255,255,0.2)" p="4">
      <div key="form" style={{ width: "100%" }}>
        <VStack spacing={6} align="flex-start" w="100%">
          <Box w="100%">
            <FormLabel htmlFor="amount">Order Type</FormLabel>
            <Flex direction="row" width="100%" gap="4">
              <Button
                colorScheme={orderType === OrderType.BUY ? "green" : "gray"}
                width="100%"
                onClick={() => setOrderType(OrderType.BUY)}
                size="sm"
              >
                Buy
              </Button>
              <Button
                colorScheme={orderType === OrderType.SELL ? "green" : "gray"}
                width="100%"
                onClick={() => setOrderType(OrderType.SELL)}
                size="sm"
              >
                Sell
              </Button>
              <Button
                colorScheme={orderType === OrderType.WRAP ? "green" : "gray"}
                width="100%"
                onClick={() => setOrderType(OrderType.WRAP)}
                size="sm"
              >
                Wrap
              </Button>
              <Button
                colorScheme={orderType === OrderType.UNWRAP ? "green" : "gray"}
                width="100%"
                onClick={() => setOrderType(OrderType.UNWRAP)}
                size="sm"
              >
                Unwrap
              </Button>
            </Flex>
          </Box>
          <Box w="100%">
            <FormControl key="amount" mb="2">
              <FormLabel
                display="flex"
                justifyContent="space-between"
                htmlFor="amount"
              >
                Amount
                <Flex
                  alignItems="center"
                  fontWeight="normal"
                  fontSize="sm"
                  opacity="0.5"
                >
                  Balance:&nbsp;
                  {Number(data?.formatted).toLocaleString("en-US")} {inputToken}
                </Flex>
              </FormLabel>
              <InputGroup>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  variant="filled"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value).toString())}
                />
                <InputRightElement width="6rem">{inputToken}</InputRightElement>
              </InputGroup>
            </FormControl>
            {(orderType === OrderType.BUY || orderType === OrderType.SELL) && (
              <Flex rowGap={1} direction="row" width="100%" gap="4">
                <FormControl>Slippage Tolerance: {slippage}% </FormControl>
                <SlippageSelector value={slippage} onChange={setSlippage} />
              </Flex>
            )}
            <Flex>
              {(orderType === OrderType.BUY ||
                orderType === OrderType.SELL) && (
                <Text>Estimated&nbsp;</Text>
              )}{" "}
              Fill:&nbsp; 0 {outputToken}
            </Flex>
          </Box>
          <Button
            key="button"
            type="submit"
            colorScheme={true ? "green" : "red"}
            width="full"
            onClick={submit}
            isDisabled={Number(amount) <= 0}
            isLoading={isLoading}
          >
            Submit Order
          </Button>
        </VStack>
      </div>
    </Box>
  );
}
