import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react";
import { wei } from "@synthetixio/wei";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useModifyCollateral } from "../../../hooks/perps/useModifyCollateral";
import { useContract } from "../../../hooks/useContract";
import { Amount } from "../../Amount";
import { useActivePerpsMarket } from "../../../hooks/perps/useActivePerpsMarket";

export function DepositCollateral({
  synth,
  accountId,
  refetch,
}: {
  synth: string;
  accountId: string;
  refetch: () => void;
}) {
  const [nativeUnit, setNativeUnit] = useState(true);
  const USD = useContract("USD");
  const { address } = useAccount();
  const { market } = useActivePerpsMarket();
  const [amount, setAmount] = useState("0");

  const { data: synthBalance, refetch: refetcSynth } = useBalance({
    address,
    token: synth as `0x${string}`,
    watch: true,
    enabled: !!synth,
  });
  const { data: USDBalance, refetch: refetchUSD } = useBalance({
    address,
    token: USD.address as `0x${string}`,
    watch: true,
  });

  const toast = useToast({
    isClosable: true,
    duration: 9000,
  });

  const onSuccess = () => {
    toast({
      title: "Successfully done",
      status: "success",
    });
    refetcSynth();
    refetchUSD();
    setAmount("0");
    refetch();
  };

  const { submit, isLoading } = useModifyCollateral(
    nativeUnit ? 0 : 2,
    accountId,
    amount,
    nativeUnit ? USD.address : synth,
    onSuccess,
  );

  if (!market) {
    return null;
  }

  return (
    <>
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
                value={wei(
                  (nativeUnit
                    ? USDBalance?.formatted
                    : synthBalance?.formatted) || "0",
                )}
                suffix={nativeUnit ? "USD" : market.marketSymbol}
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
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setNativeUnit((e) => !e)}
              >
                {nativeUnit ? "USD" : "snxETH"}
              </Button>
            </InputRightElement>
          </NumberInput>
        </InputGroup>
      </FormControl>

      <Button
        key="button"
        type="submit"
        colorScheme={address ? "green" : "gray"}
        width="full"
        my="4"
        onClick={() => submit(true)}
        isDisabled={!address || Number(amount) <= 0}
        isLoading={isLoading}
      >
        {address ? "Deposit" : "Connect your wallet"}
      </Button>
    </>
  );
}
