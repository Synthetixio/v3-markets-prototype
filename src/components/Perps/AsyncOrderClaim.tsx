import { Flex, Box, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { wei } from "@synthetixio/wei";
import { BigNumber } from "ethers";
import { defaultAbiCoder, formatEther } from "ethers/lib/utils.js";
import { useMemo, useState } from "react";
import { useContractRead } from "wagmi";
import { useActivePerpsMarket } from "../../hooks/perps/useActivePerpsMarket";
import { useContract } from "../../hooks/useContract";
import { useGetBlock } from "../../hooks/useGetBlock";
import { useTransact } from "../../hooks/useTransact";
import { fromNow } from "../../utils/date";
import { prettyString } from "../../utils/format";
import { Amount } from "../Amount";

export interface PerpsAsyncOrder {
  request: {
    accountId: string;
    marketId: string;
    sizeDelta: BigNumber;
    settlementStrategyId: string;
    acceptablePrice: BigNumber;
    trackingCode: string;
  };
  settlementTime: BigNumber;
}

interface Props {
  orderClaim: PerpsAsyncOrder;
  accountId: string;
  refetch: () => void;
}

export function AsyncOrderClaim({ orderClaim, accountId, refetch }: Props) {
  const perpsMarket = useContract("PERPS_MARKET");
  const oracleVerifier = useContract("OracleVerifier");
  const { market: perps } = useActivePerpsMarket();

  const [settling, setSettling] = useState(false);
  const { timestamp: block } = useGetBlock();

  const { data: settlementStrategy } = useContractRead({
    address: perpsMarket.address,
    abi: perpsMarket.abi,
    functionName: "getSettlementStrategy",
    args: [perps?.id, 0],
  });

  const { transact } = useTransact();
  const toast = useToast({
    isClosable: true,
    duration: 9000,
  });

  const settleOrderLocal = () => {
    const extraData = defaultAbiCoder.encode(["uint128"], [accountId]);

    let settlementTimeBytes = defaultAbiCoder.encode(
      ["uint256"],
      [orderClaim.settlementTime],
    );
    settlementTimeBytes = settlementTimeBytes.substring(
      settlementTimeBytes.length - 8,
      settlementTimeBytes.length,
    );
    settlementTimeBytes = "00000000" + settlementTimeBytes;

    const data =
      defaultAbiCoder.encode(["bytes32"], [settlementStrategy?.feedId]) +
      settlementTimeBytes;

    return {
      urls: [settlementStrategy?.url! as string],
      data,
      extraData,
    };
  };

  const outsideSettlementWindow = useMemo(() => {
    if (!block || !settlementStrategy?.settlementWindowDuration) return false;

    const startTime = Number(orderClaim.settlementTime);
    const expirationTime =
      startTime + Number(settlementStrategy.settlementWindowDuration);

    if (block < startTime || block >= expirationTime) {
      return true;
    }
    return false;
  }, [orderClaim, settlementStrategy, block]);

  const settle = async () => {
    // let urls = [];
    // let data = "";
    // let extraData = "";

    // try {
    //   setSettling(true);
    //   await perpsMarket.contract.callStatic.settle(perps?.marketId, accountId);
    // } catch (error: any) {
    //   urls = error.errorArgs.urls;
    //   data = error.errorArgs.callData;
    //   extraData = error.errorArgs.extraData;

    // } finally {
    //   setSettling(false);
    // }

    const { urls, data, extraData } = settleOrderLocal();

    if (!urls || !data || !extraData) {
      setSettling(false);
      return;
    }

    const fee = await oracleVerifier.contract.getUpdateFee(1);
    const parsedURL = urls[0].replace("{data}", data);

    const response = await fetch(parsedURL)
      .then((res) => res.json())
      .catch(() => {
        setSettling(false);
      });

    if (!response) {
      setSettling(false);
      return;
    }

    try {
      console.log(response.data, extraData);
      // await perpsMarket.contract.callStatic.settlePythOrder(
      //   response.data,
      //   extraData,
      //   {
      //     value: fee.toString(),
      //   },
      // );
      await transact(
        perpsMarket.contract,
        "settlePythOrder",
        [response.data, extraData],
        fee.toString(),
      );

      toast({
        title: "Successfully done",
        description: "Refresh in a few seconds",
        status: "success",
      });
      refetch();
    } catch (error: any) {
      if (error.errorName) {
        console.log("error:,", error.errorName);
      } else {
        console.log("error:,", error);
      }
    } finally {
      setSettling(false);
    }
  };

  return (
    <Box p="4" borderBottom="1px solid rgba(255,255,255,0.2)">
      <Flex flexDirection="column" height="100%" gap={2}>
        <Heading size="sm">Pending Order</Heading>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          acceptablePrice
          <Text display="inline" fontFamily="mono">
            <Amount
              value={wei(
                formatEther(
                  orderClaim.request.acceptablePrice?.toString() || "0",
                ),
              )}
              suffix="USD"
            />
          </Text>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          Size
          <Text display="inline" fontFamily="mono">
            <Amount
              value={wei(
                formatEther(orderClaim.request.sizeDelta?.toString() || "0"),
              )}
            />
          </Text>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          Settlement Time
          <Text display="inline" fontFamily="mono">
            {fromNow(Number(orderClaim.settlementTime) * 1000)}
          </Text>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          Tracking Code
          <Text display="inline" fontFamily="mono">
            {prettyString(orderClaim.request.trackingCode)}
          </Text>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={4}
          mt={4}
          justifyContent="space-between"
        >
          <Button
            isDisabled={outsideSettlementWindow || !block}
            flex={1}
            onClick={settle}
            isLoading={settling}
          >
            Settle
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
