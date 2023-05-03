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
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useState } from "react";
import { Form } from "react-router-dom";
import { useContractWrite } from "wagmi";
import { StrategyType } from "../../constants/order";
import { useContract } from "../../hooks/useContract";

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
      settlementWindowDuration: 120,
      priceVerificationContract: oracleVerifier.address,
      feedId: ethers.utils.formatBytes32String("ETH/USD"),
      url: "https://fakeapi.pyth.network/",
      settlementReward: parseEther("5").toString(),
      priceDeviationTolerance: parseEther("0.2").toString(),
      minimumUsdExchangeAmount: parseEther("0.000001").toString(),
      maxRoundingLoss: parseEther("0.000001").toString(),
      disabled: false,
    };

    console.log("strategy:", strategy);
    console.log("marketId:", marketId);

    setIsLoading(true);
    try {
      const id = await spotMarket.contract.callStatic.addSettlementStrategy(
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
