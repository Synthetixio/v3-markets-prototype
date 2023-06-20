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
import { formatEther } from "ethers/lib/utils.js";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useContractRead } from "wagmi";
import { perpsMarkets } from "../../../constants/markets";
import { useModifyCollateral } from "../../../hooks/perps/useModifyCollateral";
import { useContract } from "../../../hooks/useContract";
import { Amount } from "../../Amount";

export function WithdrawCollateral({ accountId }: { accountId: string }) {
  const { address } = useAccount();
  const { marketId } = useParams();
  const perpsMarket = useContract("PERPS_MARKET");
  const market = perpsMarkets[420][marketId?.toUpperCase() || "ETH"];
  const [amount, setAmount] = useState("0");

  const { data: collateralValue } = useContractRead({
    address: perpsMarket.address,
    abi: perpsMarket.abi,
    functionName: "totalCollateralValue",
    args: [accountId],
    enabled: !!address,
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
    // refetch();
    setAmount("0");
  };

  const { submit, isLoading } = useModifyCollateral(
    market.marketId,
    accountId,
    amount,
    "",
    onSuccess,
  );

  // console.log({ collateralValue });
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
                value={wei(formatEther(collateralValue?.toString() || "0"))}
                suffix="USD"
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
            // max={Number(synthBalance?.formatted)}
          >
            <NumberInputField />
            <InputRightElement width="6rem">USD</InputRightElement>
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
