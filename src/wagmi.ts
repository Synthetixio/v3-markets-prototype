import { configureChains, createClient } from "wagmi";
import { optimism, optimismGoerli } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { infuraProvider } from "wagmi/providers/infura";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const networks = {
  cannon: {
    id: 13370,
    name: "Cannon",
    network: "cannon",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpcUrls: {
      alchemy: {
        http: ["http://localhost:8545"],
      },
      default: {
        http: ["http://localhost:8545"],
      },
      public: {
        http: ["http://localhost:8545"],
      },
    },
  },
  "optimism-goerli": optimismGoerli,
  optimism,
};

type Network = keyof typeof networks;

const VITE_NETWORK = (import.meta.env.VITE_NETWORK || "cannon") as Network;

if (!networks[VITE_NETWORK]) {
  throw new Error(`Invalid network name "${VITE_NETWORK}"`);
}

const networkList = Object.entries(networks)
  .map(([_key, value]) => value)
  .filter((network) => {
    return VITE_NETWORK === "cannon" || network.id !== 13370;
  });

/**
 * Tell wagmi which chains you want to support
 * To add a new chain simply import it and add it here
 * @see https://wagmi.sh/react/providers/configuring-chains
 */
const { chains, provider } = configureChains(networkList, [
  infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY! }),
  /**
   * Tells wagmi to use the default RPC URL for each chain
   * for some dapps the higher rate limits of Alchemy may be required
   */
  jsonRpcProvider({
    rpc: (chain) => {
      console.log({
        chain: chain.rpcUrls,
      });
      return { http: chain.rpcUrls.alchemy.http[0] };
    },
  }),
]);

/**
 * Export chains to be used by rainbowkit
 * @see https://wagmi.sh/react/providers/configuring-chains
 */
export { chains };

/**
 * Configures wagmi connectors for rainbowkit
 * @see https://www.rainbowkit.com/docs/custom-wallet-list
 * @see https://wagmi.sh/react/connectors
 */
const { connectors } = getDefaultWallets({
  appName: "Synthetix V3 Markets Prototype",
  chains,
});

/**
 * Creates a singleton wagmi client for the app
 * @see https://wagmi.sh/react/client
 */
export const client = createClient({
  autoConnect: true,
  connectors: connectors,
  provider,
});
