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

export const useChainId = () => {
  const network = useDefaultNetwork();
  if (!network) throw new Error("Network not found");
  return network.id;
};

export const useChainContextName = () => {
  const chain = useChainId();
  const clientMap = {
    "10": "optimism",
    "420": "optimismGoerli",
    "84531": "baseGoerli",
  };

  return (clientMap as any)[chain];
};
