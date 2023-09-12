import { useToken } from "wagmi";
import { Box, Code, Heading, Text, Flex, Link } from "@chakra-ui/react";
import {
  useSpotMarketInfo,
  useSpotMarketStat,
} from "../../hooks/spot/useSpotMarketInfo";
import { useState } from "react";
import { AsyncOrderModal } from "./Orders/AsyncOrderModal";

export function MarketDetails({ marketId }: { marketId: number }) {
  const { synthAddress, asyncFixedFee, marketSkewScale, unwrapFee, wrapFee } =
    useSpotMarketInfo(marketId);
  const { reportedDebt, wrappedAmount } = useSpotMarketStat(marketId);
  const { data: tokenInfo } = useToken({
    address: synthAddress as `0x${string}`,
  });
  const [orderHistory, setOrderHistory] = useState(false);

  // const collateral = "0x2E5ED97596a8368EB9E44B1f3F25B2E813845303";

  // const core = useContract("SYNTHETIX");

  // const { approve, allowance } = useApprove(
  //   collateral,
  //   parseEther("10"),
  //   core.address,
  // );

  // const stake = async () => {
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
  // };

  if (!marketId || !synthAddress) {
    return null;
  }

  return (
    <Box>
      {/* <Button onClick={stake}>Stake</Button> */}
      <AsyncOrderModal
        marketId={marketId}
        isOpen={orderHistory}
        defaultIndex={0}
        onClose={() => setOrderHistory(false)}
      />

      <Flex>
        <Box w="50%" mb="3">
          <Heading size="xs">Synth</Heading>
          {tokenInfo?.name}{" "}
          <Text display="inline" fontSize="xs" opacity="0.5">
            ({tokenInfo?.symbol})
          </Text>
        </Box>
        <Box w="50%" mb="3">
          <Heading size="xs">Orders</Heading>
          <Text display="inline">
            <Link color="blue.200" onClick={() => setOrderHistory(true)}>
              View Orders
            </Link>
          </Text>
        </Box>
      </Flex>

      <Box mb="3">
        <Heading size="xs">Synth Address</Heading>
        <Code>{synthAddress}</Code>
      </Box>

      <Flex>
        <Box w="50%" mb="3">
          <Heading size="xs">Total {tokenInfo?.symbol} Issued</Heading>$
          {Number(reportedDebt).toLocaleString("en-US", {
            maximumFractionDigits: 10,
          })}
        </Box>

        <Box w="50%" mb="3">
          <Heading size="xs">Fixed Fee</Heading>
          {asyncFixedFee}%
        </Box>
      </Flex>

      <Flex>
        <Box w="50%" mb="3">
          <Heading size="xs">Total ETH Wrapped</Heading>
          {wrappedAmount} ETH
        </Box>

        <Box w="50%" mb="3">
          <Heading size="xs">Skew Scale</Heading>
          {marketSkewScale} ETH
        </Box>
      </Flex>
      <Flex>
        <Box w="50%">
          <Heading size="xs">Wrap Fee</Heading>
          {wrapFee}%
        </Box>

        <Box w="50%">
          <Heading size="xs">Unwrap Fee</Heading>
          {unwrapFee}%
        </Box>
      </Flex>
    </Box>
  );
}
