import { ethers } from "ethers";
import { useProvider, useSigner } from "wagmi";
import Multicall from "../constants/TrustedMulticallForwarder.json";
import { baseGoerli } from "wagmi/dist/chains";

export const useMulticallForwarder = () => {
  const provider = useProvider({
    chainId: baseGoerli.id,
  });
  const { data: signer } = useSigner();

  return {
    address: Multicall.address as `0x${string}`,
    abi: Multicall.abi,
    contract: new ethers.Contract(
      Multicall.address,
      Multicall.abi,
      signer || provider,
    ),
    chainId: baseGoerli.id,
  };
};
