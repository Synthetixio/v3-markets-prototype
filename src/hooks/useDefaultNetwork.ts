import { useNetwork } from "wagmi";
import { optimismGoerli } from "wagmi/chains";
import { networkList } from "../wagmi";

export const isChainSupported = (chainId: number | undefined) =>
  networkList.findIndex((network) => network.id === chainId) > -1;

export const useDefaultNetwork = () => {
  const { chain } = useNetwork();

  const network = isChainSupported(chain?.id) ? chain : null;

  return network || optimismGoerli;
};
