import {
  Button,
  Flex,
  Heading,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { wei } from "@synthetixio/wei";
import { formatEther } from "ethers/lib/utils.js";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAccount, useContractRead } from "wagmi";
import { usePerpsMarketId } from "../../../hooks/perps/usePerpsMarketId";
import { useSpotMarketId } from "../../../hooks/spot/useSpotMarketId";
import { useSpotMarketInfo } from "../../../hooks/spot/useSpotMarketInfo";
import { useContract } from "../../../hooks/useContract";
import { Amount } from "../../Amount";
import { DepositCollateral } from "./DepositCollateral";
import { WithdrawCollateral } from "./WithdrawCollateral";

export function AccountOverview() {
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  const market = useSpotMarketId();
  const perps = usePerpsMarketId();
  const { synthAddress } = useSpotMarketInfo(market?.marketId);

  const [searchParams] = useSearchParams();
  const selectedAccountId = searchParams.get("accountId");

  const { address } = useAccount();
  const perpsMarket = useContract("PERPS_MARKET");
  const { data: collateralValue, refetch: refetchTotalCollateralValue } =
    useContractRead({
      address: perpsMarket.address,
      abi: perpsMarket.abi,
      functionName: "totalCollateralValue",
      args: [selectedAccountId],
      enabled: !!selectedAccountId,
    });
  const { data: openInterest, refetch: refetshTotalAccountOpenInterest } =
    useContractRead({
      address: perpsMarket.address,
      abi: perpsMarket.abi,
      functionName: "totalAccountOpenInterest",
      args: [selectedAccountId],
      enabled: !!selectedAccountId,
    });
  const { data: price } = useContractRead({
    address: perpsMarket.address,
    abi: perpsMarket.abi,
    functionName: "indexPrice",
    args: [perps?.marketId],
    enabled: !!address,
  });
  const { data: availableMargin, refetch: refetchAvailableMargin } =
    useContractRead({
      address: perpsMarket.address,
      abi: perpsMarket.abi,
      functionName: "getAvailableMargin",
      args: [selectedAccountId],
      enabled: !!selectedAccountId,
    });

  const refetch = () => {
    refetchAvailableMargin();
    refetshTotalAccountOpenInterest();
    refetchTotalCollateralValue();
  };
  return (
    <Box p="4" borderBottom="1px solid rgba(255,255,255,0.2)">
      <Flex align="center" mb="3" gap="2">
        <Heading size="sm">Account Overview</Heading>
        <Button
          onClick={() => setOpenDeposit(true)}
          size="xs"
          colorScheme="cyan"
          isDisabled={!selectedAccountId}
        >
          Deposit
        </Button>
        <Button
          onClick={() => setOpenWithdraw(true)}
          size="xs"
          colorScheme="cyan"
          isDisabled={!selectedAccountId}
        >
          Withdraw
        </Button>
      </Flex>

      <Modal
        isOpen={openDeposit}
        onClose={() => setOpenDeposit(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deposit Collateral</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAccountId && synthAddress && (
              <DepositCollateral
                synth={synthAddress}
                accountId={selectedAccountId}
                refetch={refetch}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw Collateral</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAccountId && (
              <WithdrawCollateral
                synth={synthAddress}
                accountId={selectedAccountId}
                refetch={refetch}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Need the before/after component */}
      <Box mb="1">
        Current Price{" "}
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            <Amount
              value={wei(formatEther(price?.toString() || "0"))}
              suffix="USD"
            />
          </Text>
        </Box>
      </Box>
      <Box mb="1">
        Collateral{" "}
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            <Amount
              value={wei(formatEther(collateralValue?.toString() || "0"))}
              suffix="USD"
            />
          </Text>
        </Box>
      </Box>
      <Box mb="1">
        Open Interest{" "}
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            <Amount
              value={wei(formatEther(openInterest?.toString() || "0"))}
              suffix="USD"
            />
          </Text>
        </Box>
      </Box>
      <Box mb="1">
        Available Margin{" "}
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            <Amount
              value={wei(formatEther(availableMargin?.toString() || "0"))}
              suffix="USD"
            />
          </Text>
        </Box>
      </Box>
      {/*
      <Box mb="1">
        Margin Usage{" "}
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            15%
          </Text>{" "}
          <ArrowForwardIcon mt="-1" />{" "}
          <Text display="inline" fontFamily="mono">
            15%
          </Text>
        </Box>
      </Box>
      <Alert status="warning" fontSize="sm" mt="3">
        <AlertIcon />
        If Margin Usage exceeds 100%, you will be liquidated and lose everything
        you deposited.
      </Alert> */}
    </Box>
  );
}
