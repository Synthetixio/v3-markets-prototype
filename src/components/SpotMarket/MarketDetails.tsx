import { formatEther, formatUnits, parseEther } from "ethers/lib/utils.js";
import { useState } from "react";
import { useAccount, useToken } from "wagmi";
import {
  Box,
  Code,
  Heading,
  Text,
  SimpleGrid,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import {
  useSpotMarketInfo,
  useSpotMarketStat,
} from "../../hooks/spot/useSpotMarketInfo";
import { useApprove } from "../../hooks/useApprove";
import { useContract } from "../../hooks/useContract";
import { AsyncOrderModal } from "./AsyncOrderModal/AsyncOrderModal";
import { useGetSettlementStrategy } from "../../hooks/spot/useGetSettlementStrategy";

export function MarketDetails({ marketId }: { marketId: number }) {
  const { synthAddress } = useSpotMarketInfo(marketId);
  const { reportedDebt, withdrawableMarketUsd } = useSpotMarketStat(marketId);
  const { data: tokenInfo } = useToken({
    address: synthAddress as `0x${string}`,
  });
  // const collateral = "0x2E5ED97596a8368EB9E44B1f3F25B2E813845303";

  // const core = useContract("SYNTHETIX");
  // const { address } = useAccount();

  // const { approve, allowance } = useApprove(
  //   collateral,
  //   parseEther("10"),
  //   core.address,
  // );

  const stake = async () => {
    // const c = (
    //   await core.contract.getCollateralConfigurations(true)
    // )[0].minDelegationD18.toString();
    // console.log("collaterals:", formatEther(c).toString());
    // await systems().Core.connect(user)['createAccount(uint128)'](accountId);
    //6430
    // const id = Math.floor(Math.random() * 10000) + 1;
    // const id = 6430;
    // const pool = 1;
    // await core.contract["createAccount(uint128)"](id);
    // await approve();
    // let tx = await core.contract.deposit(id, collateral, parseEther("5"));
    // await tx.wait();
    // let tx = await core.contract.delegateCollateral(
    //   id,
    //   pool,
    //   collateral,
    //   parseEther("10"),
    //   parseEther("1"),
    // );
    // await tx.wait();
    // await core.contract.mintUsd(id, pool, collateral, parseEther("6"));
    // await systems()
    // .Core.connect(trader1)
    // .mintUsd(1000, 2, collateralAddress, depositAmount.mul(200));
    // USD.contract.mint(address, 1000);
  };

  if (!marketId || !synthAddress) {
    return null;
  }

  return (
    <Box>
      {/* <Button onClick={stake}>Stake</Button> */}
      <Box mb="4">
        <Heading size="sm">Synth</Heading>
        {tokenInfo?.name}{" "}
        <Text display="inline" fontSize="sm" opacity="0.5">
          ({tokenInfo?.symbol})
        </Text>
      </Box>

      <Box mb="4">
        <Heading size="sm">Synth Address</Heading>
        <Code>{synthAddress}</Code>
      </Box>

      <Flex>
        <Box w="50%" mb="4">
          <Heading size="sm">Total {tokenInfo?.symbol} Issued</Heading>$
          {Number(reportedDebt).toLocaleString("en-US")}
        </Box>

        <Box w="50%" mb="4">
          <Heading size="sm">Fixed Fee</Heading>
          async%
        </Box>
      </Flex>

      <Flex>
        <Box w="50%" mb="4">
          <Heading size="sm">Total ETH Wrapped</Heading>
          -- ETH
        </Box>

        <Box w="50%" mb="4">
          <Heading size="sm">Skew Fee</Heading>
          --%
        </Box>
      </Flex>
    </Box>
  );
}
