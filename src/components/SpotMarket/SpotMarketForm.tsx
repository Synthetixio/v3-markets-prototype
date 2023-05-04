import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
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
  const [slippage, setSlippage] = useState(3);
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
        <VStack spacing={4} align="flex-start" w="100%">
          <FormLabel htmlFor="amount">Order Type</FormLabel>
          <Flex rowGap={1} direction="row" width="100%" gap="4">
            <Button
              colorScheme={orderType === OrderType.BUY ? "green" : "gray"}
              width="100%"
              onClick={() => setOrderType(OrderType.BUY)}
            >
              Buy
            </Button>
            <Button
              colorScheme={orderType === OrderType.SELL ? "green" : "gray"}
              width="100%"
              onClick={() => setOrderType(OrderType.SELL)}
            >
              Sell
            </Button>
            <Button
              colorScheme={orderType === OrderType.WRAP ? "green" : "gray"}
              width="100%"
              onClick={() => setOrderType(OrderType.WRAP)}
            >
              Wrap
            </Button>
            <Button
              colorScheme={orderType === OrderType.UNWRAP ? "green" : "gray"}
              width="100%"
              onClick={() => setOrderType(OrderType.UNWRAP)}
            >
              Unwrap
            </Button>
          </Flex>
          <FormControl key="amount">
            <FormLabel
              display="flex"
              justifyContent="space-between"
              htmlFor="amount"
            >
              Amount
              <Flex alignItems="center">
                {Number(data?.formatted).toLocaleString("en-US")} snxUSD
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
              <InputRightElement width="6rem">snxUSD</InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl>Slippage protection: {slippage}% </FormControl>
          <Flex rowGap={1} direction="row" width="100%" gap="4">
            <SlippageSelector value={slippage} onChange={setSlippage} />
          </Flex>
          <FormControl>
            <RadioGroup
              onChange={setSettlementType}
              value={settlementType}
              defaultValue="async"
            >
              <Stack spacing={5} direction="row">
                <Radio value="async">Async</Radio>
                <Radio value="atomic">Atomic</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl>Strategy Type </FormControl>
          <FormControl>
            <RadioGroup
              onChange={setStrategyType}
              value={strategyType}
              defaultValue="1"
            >
              <Stack spacing={5} direction="row">
                <Radio value="1">Pyth</Radio>
                <Radio value="2">OnChain</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <Button
            key="button"
            type="submit"
            size="lg"
            colorScheme={true ? "green" : "red"}
            width="full"
            onClick={submit}
            isDisabled={Number(amount) <= 0}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </VStack>
      </div>
    </Box>
  );
}
