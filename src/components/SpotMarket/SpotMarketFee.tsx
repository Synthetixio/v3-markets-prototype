import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Card,
  Heading,
  CardHeader,
} from "@chakra-ui/react";
import { parseEther } from "ethers/lib/utils.js";
import { useMemo, useState } from "react";
import { Form } from "react-router-dom";
import { FeeType } from "../../constants/order";
import { useSetFee } from "../../hooks/spot/useSetFee";

export function SpotMarketFee({ type }: { type: FeeType }) {
  const [marketId, setMarketId] = useState("");
  const [value, setValue] = useState("0");

  const amount = useMemo(() => parseEther(value).div(100).toString(), [value]);
  const { submit, isLoading } = useSetFee(marketId, amount, type);

  const title = useMemo(() => {
    switch (type) {
      case FeeType.FIXED:
        return "Fixed Fee";
      case FeeType.UTILIZATION:
        return "Utilization Fee";
      case FeeType.SKEW_SCALE:
        return "Skew Scale";
    }
  }, [type]);

  return (
    <Card width={300} p={8}>
      <CardHeader pt={0}>
        <Heading size="md" textAlign="center">
          {title}
        </Heading>
      </CardHeader>

      <Form onSubmit={submit}>
        <FormControl isRequired>
          <FormLabel>Market Id</FormLabel>
          <Input
            variant="filled"
            placeholder="1"
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
          />
        </FormControl>

        <FormControl mt={3} isRequired>
          <FormLabel>{title}</FormLabel>

          <Input
            id="amount"
            name="amount"
            type="number"
            variant="filled"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            max={type === FeeType.UTILIZATION ? undefined : 100}
          />
        </FormControl>

        <Button
          isLoading={isLoading}
          mt={4}
          colorScheme="teal"
          type="submit"
          isDisabled={!marketId || !Number(value)}
        >
          Submit
        </Button>
      </Form>
    </Card>
  );
}
