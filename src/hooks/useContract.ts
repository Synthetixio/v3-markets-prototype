import { ethers } from "ethers";
import { useProvider, useSigner } from "wagmi";
import { contracts } from "../constants/contracts";
import { useDefaultNetwork } from "./useDefaultNetwork";

type ContractName =
  | keyof typeof contracts.cannon
  | keyof (typeof contracts)["optimism-goerli"];

const NETWORK = (import.meta.env.VITE_NETWORK ||
  "cannon") as keyof typeof contracts;

export const useContract = (name: ContractName) => {
  const network = useDefaultNetwork();

  if (name === "chainId") {
    throw new Error('Cannot use "chainId" as a contract name');
  }

  if (!contracts[NETWORK]) {
    throw new Error(`Invalid network name "${NETWORK}"`);
  }

  const provider = useProvider();
  const { data: signer } = useSigner();

  const contract = contracts[network.network][name];

  if (!contract) {
    throw new Error(`Contract "${name}" not found on network "${NETWORK}"`);
  }

  return {
    address: contract.address as `0x${string}`,
    abi: contract.abi,
    contract: new ethers.Contract(
      contract.address,
      contract.abi,
      signer || provider,
    ),
    chainId: contracts[NETWORK].chainId,
  };
};
