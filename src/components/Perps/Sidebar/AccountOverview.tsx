import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Box,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSpotMarketId } from "../../../hooks/spot/useSpotMarketId";
import { useSpotMarketInfo } from "../../../hooks/spot/useSpotMarketInfo";
import { DepositCollateral } from "./DepositCollateral";
import { WithdrawCollateral } from "./WithdrawCollateral";

export function AccountOverview() {
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  const market = useSpotMarketId();
  const { synthAddress } = useSpotMarketInfo(market?.marketId);

  const [searchParams] = useSearchParams();
  const selectedAccountId = searchParams.get("accountId");

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
              <WithdrawCollateral accountId={selectedAccountId} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Need the before/after component */}
      <Box mb="1">
        Buying Power{" "}
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            $10,000
          </Text>{" "}
          <ArrowForwardIcon mt="-1" />{" "}
          <Text display="inline" fontFamily="mono">
            $10,000
          </Text>
        </Box>
      </Box>
      <Box mb="1">
        Free Collateral{" "}
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            $1,000
          </Text>{" "}
          <ArrowForwardIcon mt="-1" />{" "}
          <Text display="inline" fontFamily="mono">
            $1,000
          </Text>
        </Box>
      </Box>
      <Box mb="1">
        Leverage
        <Box display="inline" float="right">
          <Text display="inline" fontFamily="mono">
            1&times;
          </Text>{" "}
          <ArrowForwardIcon mt="-1" />{" "}
          <Text display="inline" fontFamily="mono">
            2&times;
          </Text>
        </Box>
      </Box>
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
      </Alert>
    </Box>
  );
}
