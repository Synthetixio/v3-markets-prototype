import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  InputGroup,
  InputRightElement,
  Heading,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { usePerpsMarketOrder } from "../../../../hooks/perps/usePerpsMarketOrder";
import { initialOrderFormState, reducer } from "./reducer";

export const maxLeverage = 100;

interface Props {
  refetch: () => void;
}
export function OrderForm({ refetch }: Props) {
  const [state, dispatch] = useReducer(reducer, initialOrderFormState);
  const [searchParams] = useSearchParams();
  const selectedAccountId = searchParams.get("accountId");

  const { amount, buy } = state;

  const { commit, isLoading } = usePerpsMarketOrder(
    selectedAccountId || "",
    amount?.toString() || "0",
    "0",
    10,
    () => {
      refetch();
    },
  );

  const handleSubmit = () => {
    commit();
  };

  return (
    <Box flex="1" overflowY="scroll" p="4">
      <>
        <Heading size="sm" mb="3">
          Market Order
        </Heading>
        <div key="form" style={{ width: "100%" }}>
          <VStack spacing={4} align="flex-start" w="100%">
            <Flex direction="row" width="100%" gap="4">
              <Button
                onClick={() =>
                  dispatch({ type: "set_buy", payload: { buy: true } })
                }
                colorScheme={buy ? "green" : "gray"}
                width="100%"
                mr="1"
              >
                Buy
              </Button>
              <Button
                onClick={() =>
                  dispatch({ type: "set_buy", payload: { buy: false } })
                }
                colorScheme={buy ? "gray" : "red"}
                width="100%"
                ml="1"
              >
                Sell
              </Button>
            </Flex>
            <FormControl key="amount">
              <FormLabel htmlFor="amount">Amount</FormLabel>
              {/* <InputGroup>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  variant="filled"
                  value={amount || ""}
                  onChange={(val) => {
                    const newAmount = isNaN(parseInt(val.target.value))
                      ? null
                      : parseInt(val.target.value);
                    dispatch({
                      type: "set_amount",
                      payload: { amount: newAmount },
                    });
                  }}
                />
                <InputRightElement width="4.5rem">USD</InputRightElement>
              </InputGroup> */}

              <InputGroup>
                <NumberInput
                  width="full"
                  id="amount"
                  name="amount"
                  variant="filled"
                  min={0}
                  value={amount || ""}
                  onChange={(_v, valueAsNumber) => {
                    dispatch({
                      type: "set_amount",
                      payload: { amount: isNaN(valueAsNumber) ? "" : _v },
                    });
                  }}
                >
                  <NumberInputField />
                  <InputRightElement width="6rem">USD</InputRightElement>
                </NumberInput>
              </InputGroup>
            </FormControl>

            <Button
              key="button"
              type="submit"
              size="lg"
              colorScheme={buy ? "green" : "red"}
              width="full"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Submit {buy ? "Buy" : "Sell"} Order
            </Button>
          </VStack>
        </div>
      </>
    </Box>
  );
}
