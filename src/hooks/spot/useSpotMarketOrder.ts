import { BigNumber, ethers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { useContractWrite, useProvider } from "wagmi";
import { addAsyncOrderId } from "../../components/SpotMarket/AsyncOrderModal/AsyncOrders";
import { useApprove } from "../useApprove";
import { useContract } from "../useContract";

const ASYNC_BUY_TRANSACTION = 3;

export const useSpotMarketBuy = (
  marketId: string | number,
  amount: string,
  slippage: number,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const usd = useContract("USD");
  const spotMarket = useContract("SPOT_MARKET");
  const oracleVerifier = useContract("OracleVerifier");
  const { approve } = useApprove(usd.address, amount, spotMarket.address);
  const provider = useProvider();

  const { writeAsync: buyTx } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: spotMarket.address,
    abi: spotMarket.abi,
    functionName: "buy",
  });

  const { writeAsync: commitOrder } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: spotMarket.address,
    abi: spotMarket.abi,
    functionName: "commitOrder",
  });

  const buyAtomic = useCallback(async () => {
    setIsLoading(true);
    try {
      await approve();
      const txReceipt = await buyTx({
        recklesslySetUnpreparedArgs: [
          marketId,
          amount,
          BigNumber.from(amount || 0)
            .mul(100 - slippage)
            .div(100)
            .toString(),
          ethers.constants.AddressZero,
        ],
      });
      await txReceipt.wait();
    } catch (error) {
      console.log("error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [approve, buyTx, marketId, amount, slippage]);

  const buyAsync = useCallback(
    async (strategyId: string) => {
      setIsLoading(true);
      try {
        await approve();

        const asyncOrderClaim =
          await spotMarket.contract.callStatic.commitOrder(
            marketId,
            ASYNC_BUY_TRANSACTION,
            amount,
            strategyId,
            0,
            ethers.constants.AddressZero,
          );

        console.log("id:,", asyncOrderClaim.id.toString());

        const txReceipt = await commitOrder({
          recklesslySetUnpreparedArgs: [
            marketId,
            ASYNC_BUY_TRANSACTION,
            amount,
            strategyId,
            0,
            ethers.constants.AddressZero,
          ],
        });

        await txReceipt.wait();

        addAsyncOrderId(Number(marketId), asyncOrderClaim.id.toString());
      } catch (error) {
        console.log("error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [approve, commitOrder, marketId, amount, slippage],
  );

  const settleAsync = useCallback(
    async (strategyId: number) => {
      setIsLoading(true);
      try {
        const block = await provider.getBlock("latest");
        console.log("block.timestamp:", block.timestamp);

        const extraData = ethers.utils.defaultAbiCoder.encode(
          ["uint128", "uint128"],
          [marketId, 1],
        );
        const pythCallData = ethers.utils.solidityPack(
          ["bytes32", "uint64"],
          [ethers.utils.formatBytes32String("ETH/USD"), block.timestamp + 5],
        );

        console.log("setting oracleVerifier set price");
        let tx = await oracleVerifier.contract.setPrice("1100");
        await tx.wait();

        tx = await spotMarket.contract.settlePythOrder(pythCallData, extraData);
        await tx.wait();
      } catch (error) {
        console.log("error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [approve, commitOrder, marketId, amount, slippage],
  );
  return {
    buyAsync,
    buyAtomic,
    isLoading,
    settleAsync,
  };
};
