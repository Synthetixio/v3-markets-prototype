import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useModifyCollateral } from "../../../hooks/perps/useModifyCollateral";
import { useContract } from "../../../hooks/useContract";
import { useActivePerpsMarket } from "../../../hooks/perps/useActivePerpsMarket";

export function WithdrawCollateral({
  accountId,
  refetch,
  synth,
}: {
  synth: string;
  accountId: string;
  refetch: () => void;
}) {
  const { address } = useAccount();
  const { market } = useActivePerpsMarket();
  const [amount, setAmount] = useState("0");

  const [nativeUnit, setNativeUnit] = useState(true);
  const USD = useContract("USD");

  // const { data: collateralValue } = useContractRead({
  //   address: perpsMarket.address,
  //   abi: perpsMarket.abi,
  //   functionName: "totalCollateralValue",
  //   args: [accountId],
  //   enabled: !!address,
  // });

  const toast = useToast({
    isClosable: true,
    duration: 9000,
  });

  const onSuccess = () => {
    toast({
      title: "Successfully done",
      status: "success",
    });
    // refetch();
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
          {/* {!!address && (
            <Flex
              alignItems="center"
              fontWeight="normal"
              fontSize="sm"
              opacity="0.5"
            >
              Balance:&nbsp;
              <Amount
                value={wei(formatEther(collateralValue?.toString() || "0"))}
                suffix="USD"
              />
            </Flex>
          )} */}
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
            // max={Number(synthBalance?.formatted)}
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
        onClick={() => submit(false)}
        isDisabled={!address || Number(amount) <= 0}
        isLoading={isLoading}
      >
        {address ? "Withdraw" : "Connect your wallet"}
      </Button>
    </>
  );
}
