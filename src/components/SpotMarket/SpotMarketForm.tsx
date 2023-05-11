import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import { parseEther } from "ethers/lib/utils.js";
import { useMemo, useState } from "react";
import { useAccount, useBalance, useToken } from "wagmi";
import { TransactionType } from "../../constants/order";
import { useSpotMarketInfo } from "../../hooks/spot/useSpotMarketInfo";
import { useSpotMarketOrder } from "../../hooks/spot/useSpotMarketOrder";
import { useContract } from "../../hooks/useContract";
import { SlippageSelector } from "../SlippageSelector";
import { AsyncOrderModal } from "./AsyncOrderModal/AsyncOrderModal";

export function SpotMarketForm({ id }: { id: number }) {
  const { synthAddress, marketName } = useSpotMarketInfo(id);
  const [isOpen, setIsOpen] = useState(false);
  const { data: synthInfo } = useToken({
    address: synthAddress as `0x${string}`,
  });
  const [slippage, setSlippage] = useState(1);
  const [amount, setAmount] = useState("0");
  // const [settlementType, setSettlementType] = useState("async");
  const [strategyType, setStrategyType] = useState("2");

  const { address } = useAccount();

  const USD = useContract("USD");
  const { data: USDBalance } = useBalance({
    address,
    token: USD.address as `0x${string}`,
    watch: true,
  });
  const { data: synthBalance } = useBalance({
    address,
    token: synthAddress as `0x${string}`,
    watch: true,
  });

  const [orderType, setOrderType] = useState(TransactionType.ASYNC_BUY);

  const usdAmount = useMemo(
    () => parseEther(amount || "0").toString(),
    [amount],
  );
  const { sellAsync, buyAsync, isLoading } = useSpotMarketOrder(
    id,
    usdAmount,
    synthAddress,
    orderType,
    slippage,
  );

  const balance = useMemo(() => {
    if (orderType === TransactionType.ASYNC_BUY) {
      return USDBalance;
    } else if (orderType === TransactionType.ASYNC_SELL) {
      return synthBalance;
    } else if (orderType === TransactionType.UNWRAP) {
      return synthBalance;
    } else if (orderType === TransactionType.WRAP) {
      return synthBalance;
    }
  }, [orderType, synthBalance, USDBalance]);

  const { inputToken, outputToken } = useMemo(() => {
    let inputToken = "snxUSD";
    let outputToken = synthInfo?.symbol || "";
    if (orderType === TransactionType.ASYNC_SELL) {
      inputToken = synthInfo?.symbol || "";
      outputToken = "snxUSD";
    } else if (orderType === TransactionType.UNWRAP) {
      inputToken = synthInfo?.symbol || "";
      outputToken = "ETH";
    } else if (orderType === TransactionType.WRAP) {
      inputToken = "ETH";
      outputToken = synthInfo?.symbol || "";
    }
    return {
      inputToken,
      outputToken,
    };
  }, [synthInfo?.symbol, orderType]);

  const submit = () => {
    if (orderType === TransactionType.ASYNC_BUY) {
      buyAsync(strategyType);
    } else if (orderType === TransactionType.ASYNC_SELL) {
      sellAsync(strategyType);
    } else if (orderType === TransactionType.UNWRAP) {
      buyAsync(strategyType);
    } else if (orderType === TransactionType.WRAP) {
      buyAsync(strategyType);
    }
  };

  return (
    <>
      <AsyncOrderModal
        marketId={id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <Box borderBottom="1px solid rgba(255,255,255,0.2)" p="4">
        <div key="form" style={{ width: "100%" }}>
          <VStack spacing={5} align="flex-start" w="100%">
            <Alert status="warning" fontSize="sm" minWidth="400px">
              <AlertIcon w="4" />
              This is an experimental prototype. Use with caution.
            </Alert>

            <Button width="100%" onClick={() => setIsOpen(true)} size="sm">
              Open Async Orders List
            </Button>
            <Box w="100%">
              <FormLabel htmlFor="amount">Order Type</FormLabel>
              <Flex direction="row" width="100%" gap="4">
                <Button
                  colorScheme={
                    orderType === TransactionType.ASYNC_BUY ? "green" : "gray"
                  }
                  width="100%"
                  onClick={() => setOrderType(TransactionType.ASYNC_BUY)}
                  size="sm"
                >
                  Buy
                </Button>
                <Button
                  colorScheme={
                    orderType === TransactionType.ASYNC_SELL ? "green" : "gray"
                  }
                  width="100%"
                  onClick={() => setOrderType(TransactionType.ASYNC_SELL)}
                  size="sm"
                >
                  Sell
                </Button>
                <Button
                  colorScheme={
                    orderType === TransactionType.WRAP ? "green" : "gray"
                  }
                  width="100%"
                  onClick={() => setOrderType(TransactionType.WRAP)}
                  size="sm"
                  isDisabled={id !== 2}
                >
                  Wrap
                </Button>
                <Button
                  colorScheme={
                    orderType === TransactionType.UNWRAP ? "green" : "gray"
                  }
                  width="100%"
                  onClick={() => setOrderType(TransactionType.UNWRAP)}
                  size="sm"
                  isDisabled={id !== 2}
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
                  {!!address && (
                    <Flex
                      alignItems="center"
                      fontWeight="normal"
                      fontSize="sm"
                      opacity="0.5"
                    >
                      Balance:&nbsp;
                      {Number(balance?.formatted).toLocaleString("en-US")}{" "}
                      {inputToken}
                    </Flex>
                  )}
                </FormLabel>

                <InputGroup>
                  <NumberInput
                    width="full"
                    id="amount"
                    name="amount"
                    variant="filled"
                    min={0}
                    value={amount}
                    onChange={(_v, valueAsNumber) => {
                      setAmount(isNaN(valueAsNumber) ? "" : _v);
                    }}
                    precision={18}
                  >
                    <NumberInputField />
                    <InputRightElement width="6rem">
                      {inputToken}
                    </InputRightElement>
                  </NumberInput>
                </InputGroup>
              </FormControl>
              {(orderType === TransactionType.ASYNC_BUY ||
                orderType === TransactionType.ASYNC_SELL) && (
                <Flex rowGap={1} direction="row" width="100%" gap="4">
                  <FormControl>Slippage Tolerance: {slippage}% </FormControl>
                  <SlippageSelector value={slippage} onChange={setSlippage} />
                </Flex>
              )}
              {(orderType === TransactionType.WRAP ||
                orderType === TransactionType.UNWRAP) && (
                <Flex rowGap={1} direction="row" width="100%" gap="4">
                  Fee: X%
                </Flex>
              )}
              <Flex>
                {(orderType === TransactionType.ASYNC_BUY ||
                  orderType === TransactionType.ASYNC_SELL) && (
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
              isDisabled={!address || Number(amount) <= 0}
              isLoading={isLoading}
            >
              {address ? "Submit Order" : "Connect your wallet"}
            </Button>
          </VStack>
        </div>
      </Box>
    </>
  );
}
