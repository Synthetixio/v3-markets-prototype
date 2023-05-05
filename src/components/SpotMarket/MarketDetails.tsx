import { Box, Button, Heading } from "@chakra-ui/react";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils.js";
import { useState } from "react";
import { useAccount, useToken } from "wagmi";
import {
  useSpotMarketInfo,
  useSpotMarketStat,
} from "../../hooks/spot/useSpotMarketInfo";
import { useApprove } from "../../hooks/useApprove";
import { useContract } from "../../hooks/useContract";

export function MarketDetails({ id }: { id: number }) {
  const { synthAddress, marketName } = useSpotMarketInfo(id);
  const { reportedDebt, withdrawableMarketUsd } = useSpotMarketStat(id);
  const { data: tokenInfo } = useToken({
    address: synthAddress as `0x${string}`,
  });
  const collateral = "0x2E5ED97596a8368EB9E44B1f3F25B2E813845303";

  const core = useContract("SYNTHETIX");
  const { address } = useAccount();

  const { approve, allowance } = useApprove(
    collateral,
    parseEther("10"),
    core.address,
  );

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

  if (!id || !synthAddress) {
    return null;
  }

  return (
    <Box>
      <Heading size="md" mb="3">
        Market Details
      </Heading>

      <Box mb="2">
        <Heading size="xs">Name</Heading>
        {marketName}
      </Box>

      <Box mb="2">
        <Heading size="xs">Synth Address</Heading>
        {synthAddress}

        {/* <Button onClick={stake}>Stake</Button> */}
      </Box>

      <Box mb="2">
        <Heading size="xs">Market Price</Heading>
        $0
      </Box>

      <Box mb="2">
        <Heading size="xs">
          <>{tokenInfo?.symbol} Issued</>
        </Heading>
        {Number(reportedDebt).toLocaleString("en-US")}
      </Box>

      <Box mb="2">
        <Heading size="xs">snxUSD Deposited</Heading>
        $0
      </Box>

      <Box mb="2">
        <Heading size="xs">Market Collateralization</Heading>
        $0
      </Box>

      <Box mb="2">
        <Heading size="xs">Market Credit Capacity</Heading>
        $0
      </Box>

      <Box mb="2">
        <Heading size="xs">Market Withdrawable Usd</Heading>
        {Number(withdrawableMarketUsd).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </Box>
    </Box>
  );
}
