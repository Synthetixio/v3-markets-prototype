import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  Link,
  VStack,
  useToast,
  Select,
  Heading,
} from "@chakra-ui/react";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useToken } from "wagmi";
import { TransactionType } from "../../constants/order";
import { useSpotMarketInfo } from "../../hooks/spot/useSpotMarketInfo";
import { useSpotMarketOrder } from "../../hooks/spot/useSpotMarketOrder";
import { useContract } from "../../hooks/useContract";
import { Amount } from "../Amount";
import { SlippageSelector } from "./SlippageSelector";
import { wei } from "@synthetixio/wei";
import { OrderStatus, useGetOrders } from "../../hooks/spot/useGetOrders";
import { AsyncOrderModal } from "./Orders/AsyncOrderModal";
import { useStrategyType } from "../../hooks/useStrategyType";
import { useGetWrapper } from "../../hooks/spot/useGetWrapper";
import { useGetSettlementStrategy } from "../../hooks/spot/useGetSettlementStrategy";

export function SpotMarketForm({ id }: { id: number }) {
  const { synthAddress, unwrapFee, wrapFee } = useSpotMarketInfo(id);
  const [isOpen, setIsOpen] = useState(false);

  const { wrapper, refetch: refetchCollateralInfo } = useGetWrapper(id);

  const wrapCollateralType = wrapper?.wrapCollateralType;

  const [slippage, setSlippage] = useState(1);
  const [amount, setAmount] = useState("0");
  const [strategyId, setStrategyId] = useState(0);
  const { strategies, strategy } = useGetSettlementStrategy(id, strategyId);

  const { address } = useAccount();

  const { data: synthInfo } = useToken({
    address: synthAddress as `0x${string}`,
    enabled: !!synthAddress,
  });
  const { data: wrapCollateralInfo } = useToken({
    address: wrapCollateralType as `0x${string}`,
    enabled: !!wrapCollateralType,
  });
  const { orders } = useGetOrders(id, false);
  const hasAsyncOrders = useMemo(
    () =>
      !!orders.filter((order) => order.status === OrderStatus.Commited).length,
    [orders],
  );

  const USD = useContract("USD");
  const { data: USDBalance, refetch: refetchUSD } = useBalance({
    address,
    token: USD.address as `0x${string}`,
    watch: true,
  });
  const { data: synthBalance, refetch: refetcSynth } = useBalance({
    address,
    token: synthAddress as `0x${string}`,
    watch: true,
    enabled: !!synthAddress,
  });
  const { data: wrapCollateralBalance, refetch: refetchWrapCollateral } =
    useBalance({
      address,
      token: wrapCollateralType as `0x${string}`,
      watch: true,
      enabled: !!wrapCollateralType,
    });

  const toast = useToast({
    isClosable: true,
    duration: 9000,
  });

  const onSuccess = () => {
    toast({
      title: "Order Submitted",
      description:
        "Refresh in approximately 10 seconds and click View Orders to settle your order if necessary.",
      status: "success",
    });

    refetchUSD();
    refetcSynth();
    refetchWrapCollateral();
    refetchCollateralInfo();
  };

  const [orderType, setOrderType] = useState(TransactionType.ASYNC_BUY);

  const usdAmount = useMemo(
    () => parseEther(amount || "0").toString(),
    [amount],
  );

  useEffect(() => {
    setAmount("0");
  }, [orderType]);

  const { sellAsync, buyAsync, wrap, unwrap, isLoading } = useSpotMarketOrder(
    id,
    usdAmount,
    synthAddress,
    orderType,
    wrapCollateralType,
    slippage,
    onSuccess,
  );

  const balance = useMemo(() => {
    if (orderType === TransactionType.ASYNC_BUY) {
      return USDBalance;
    } else if (orderType === TransactionType.ASYNC_SELL) {
      return synthBalance;
    } else if (orderType === TransactionType.UNWRAP) {
      return synthBalance;
    } else if (orderType === TransactionType.WRAP) {
      return wrapCollateralBalance;
    }
  }, [orderType, synthBalance, USDBalance]);

  const { inputToken } = useMemo(() => {
    let inputToken = "snxUSD";
    let outputToken = synthInfo?.symbol || "";
    if (orderType === TransactionType.ASYNC_SELL) {
      inputToken = synthInfo?.symbol || "";
      outputToken = "snxUSD";
    } else if (orderType === TransactionType.UNWRAP) {
      inputToken = synthInfo?.symbol || "";
      outputToken = wrapCollateralInfo?.symbol || "";
    } else if (orderType === TransactionType.WRAP) {
      inputToken = wrapCollateralInfo?.symbol || "";
      outputToken = synthInfo?.symbol || "";
    }
    return {
      inputToken,
      outputToken,
    };
  }, [synthInfo?.symbol, orderType]);

  const submit = () => {
    if (orderType === TransactionType.ASYNC_BUY) {
      buyAsync(strategyId);
    } else if (orderType === TransactionType.ASYNC_SELL) {
      sellAsync(strategyId);
    } else if (orderType === TransactionType.UNWRAP) {
      unwrap();
    } else if (orderType === TransactionType.WRAP) {
      wrap();
    }
  };

  return (
    <>
      <AsyncOrderModal
        marketId={id}
        defaultIndex={2}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <Box borderBottom="1px solid rgba(255,255,255,0.2)" p="4">
        <div key="form" style={{ width: "100%" }}>
          <VStack spacing={4} align="flex-start" w="100%">
            <Alert status="warning" fontSize="sm" minWidth="400px">
              <AlertIcon w="4" />
              <Box>
                This is an experimental prototype.{" "}
                <Text fontWeight="semibold" display="inline">
                  Use with caution.
                </Text>
              </Box>
            </Alert>
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
                  isDisabled={!wrapCollateralType}
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
                  isDisabled={!wrapCollateralType}
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
                      <Amount
                        onClick={(preciseValue) => setAmount(preciseValue)}
                        value={wei(balance?.formatted || "0")}
                        suffix={inputToken}
                      />
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
                  <FormControl fontSize="sm">
                    <Text fontWeight="semibold" display="inline">
                      Slippage Tolerance:
                    </Text>{" "}
                    {slippage}%{" "}
                  </FormControl>
                  <SlippageSelector value={slippage} onChange={setSlippage} />
                </Flex>
              )}
              {orderType === TransactionType.WRAP && (
                <Box fontSize="sm">
                  <Text fontWeight="semibold" display="inline">
                    Fee:
                  </Text>
                  &nbsp;{wrapFee}%
                </Box>
              )}
              {orderType === TransactionType.UNWRAP && (
                <Box fontSize="sm">
                  <Text fontWeight="semibold" display="inline">
                    Fee:
                  </Text>
                  &nbsp;{unwrapFee}%
                </Box>
              )}
            </Box>
            <Select
              onChange={(e) => setStrategyId(Number(e.target.value))}
              value={String(strategy?.settlementStrategyId || "")}
              placeholder="Settlement Strategy"
            >
              {strategies.map((strategy) => (
                <option value={String(strategy.settlementStrategyId)}>
                  #{strategy.settlementStrategyId}
                  {Number(strategy.strategyType) === 0 ? " ONCHAIN" : " PYTH"}
                </option>
              ))}
            </Select>
            {strategy && (
              <Flex w="100%">
                <Box w="50%">
                  <Heading size="xs">Settlement Delay</Heading>
                  {strategy.settlementDelay}
                </Box>
                <Box w="50%">
                  <Heading size="xs">Settlement Window Duration</Heading>
                  {strategy.settlementWindowDuration}
                </Box>
              </Flex>
            )}
            <Box w="100%">
              <Button
                key="button"
                type="submit"
                colorScheme={address ? "green" : "gray"}
                width="full"
                onClick={submit}
                isDisabled={!address || Number(amount) <= 0}
                isLoading={isLoading}
              >
                {address
                  ? strategy
                    ? "Submit Order"
                    : "Select Settlement Strategy"
                  : "Connect your wallet"}
              </Button>
              {hasAsyncOrders ? (
                <Text
                  color="blue.200"
                  w="100%"
                  fontSize="sm"
                  mt="1"
                  textAlign="center"
                >
                  <Link onClick={() => setIsOpen(true)}>
                    View Pending Orders
                  </Link>
                </Text>
              ) : (
                <Text fontSize="sm" mt="1" textAlign="center" opacity="0.5">
                  No pending orders
                </Text>
              )}
            </Box>
          </VStack>
        </div>
      </Box>
    </>
  );
}
