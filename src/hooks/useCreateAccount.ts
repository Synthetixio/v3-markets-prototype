import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import { useContract } from "./useContract";

const getId = () => {
  const randomNumber = Math.floor(Math.random() * 100000) + 1;
  return ethers.BigNumber.from(randomNumber.toString());
};

export const useCreateAccount = (onSuccess: (id: string) => void) => {
  const coreProxy = useContract("PERPS_MARKET");

  const toast = useToast({
    isClosable: true,
    duration: 9000,
  });

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: coreProxy.address,
    abi: coreProxy.abi,
    functionName: "createAccount",
    args: [getId()],
    onSuccess: () => onSuccess(getId().toString()),
  });

  return {
    createAccount: async () => {
      try {
        const id = getId();
        console.log("accountId:", id.toString());

        const tx = await writeAsync({
          recklesslySetUnpreparedArgs: [id],
        });

        await tx.wait();

        toast({
          title: "Successfully created #" + id.toString(),
          status: "success",
        });

        onSuccess(id.toString());
      } catch (error) {
        console.log("error:", error);
      }
    },
  };
};
