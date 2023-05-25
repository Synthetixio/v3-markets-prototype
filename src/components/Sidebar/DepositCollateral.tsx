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
import { useParams } from "react-router-dom";
import { useAccount, useBalance } from "wagmi";
import { perpsMarkets } from "../../constants/markets";
import { useModifyCollateral } from "../../hooks/perps/useModifyCollateral";
import { Amount } from "../Amount";

export function DepositCollateral({
  synth,
  accountId,
}: {
  synth: string;
  accountId: string;
}) {
  const { address } = useAccount();
  const { marketId } = useParams();
  const market = perpsMarkets[420][marketId?.toUpperCase() || "ETH"];
  const [amount, setAmount] = useState("0");

  const { data: synthBalance, refetch: refetcSynth } = useBalance({
    address,
    token: synth as `0x${string}`,
    watch: true,
    enabled: !!synth,
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
    setAmount("0");
  };

  const { submit, isLoading } = useModifyCollateral(
    market.marketId,
    accountId,
    amount,
    synth,
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
                value={wei(synthBalance?.formatted || "0")}
                suffix={market.synth}
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
            max={Number(synthBalance?.formatted)}
            precision={18}
          >
            <NumberInputField />
            <InputRightElement width="6rem">{market.synth}</InputRightElement>
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
