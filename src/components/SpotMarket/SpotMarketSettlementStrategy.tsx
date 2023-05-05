import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Card,
  Heading,
  CardHeader,
  useToast,
} from "@chakra-ui/react";
import { parseEther } from "ethers/lib/utils.js";
import { useState } from "react";
import { Form } from "react-router-dom";
import { useContractWrite } from "wagmi";
import { StrategyType } from "../../constants/order";
import { useContract } from "../../hooks/useContract";

const feedId =
  "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6";

export function SpotMarketSettlementStrategy() {
  const [marketId, setMarketId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const spotMarket = useContract("SPOT_MARKET");
  const oracleVerifier = useContract("OracleVerifier");

  const { writeAsync, data } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: spotMarket.address,
    abi: spotMarket.abi,
    functionName: "addSettlementStrategy",
  });
  const toast = useToast({
    isClosable: true,
    duration: 9000,
  });

  const submit = async () => {
    const strategy = {
      strategyType: StrategyType.PYTH, // pyth
      settlementDelay: 5,
      settlementWindowDuration: 600,
      priceVerificationContract: oracleVerifier.address,
      feedId: feedId,
      url: "https://xc-testnet.pyth.network/api/get_vaa_ccip?data={data}",
      settlementReward: parseEther("5").toString(),
      priceDeviationTolerance: parseEther("1000").toString(),
      disabled: false,
      minimumUsdExchangeAmount: parseEther("0.000001").toString(),
      maxRoundingLoss: parseEther("0.000001").toString(),
    };

    setIsLoading(true);
    try {
      const id = await spotMarket.contract.addSettlementStrategy(
        marketId,
        strategy,
      );
      const tx = await writeAsync({
        recklesslySetUnpreparedArgs: [marketId, strategy],
      });

      await tx.wait();

      toast({
        title: "Successfully done with id" + id,
        status: "success",
      });
    } catch (error) {
      console.log("addSettlementStrategy erorr:", error);
      toast({
        title: "addSettlementStrategy erorr",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card width={300} p={8}>
      <CardHeader pt={0}>
        <Heading size="md" textAlign="center">
          Add Settlement Strategy
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

        <Button
          isLoading={isLoading}
          mt={4}
          colorScheme="teal"
          type="submit"
          isDisabled={!marketId}
        >
          Submit
        </Button>
      </Form>
    </Card>
  );
}
