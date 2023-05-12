import { configureChains, createClient } from "wagmi";
import { optimism, optimismGoerli } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
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
      default: {
        http: ["http://localhost:8545"],
      },
      public: {
        http: ["http://localhost:8545"],
      },
    },
  },
  "optimism-goerli": optimismGoerli,
};

type Network = keyof typeof networks;

const VITE_NETWORK = (import.meta.env.VITE_NETWORK || "cannon") as Network;

if (!networks[VITE_NETWORK]) {
  throw new Error(`Invalid network name "${VITE_NETWORK}"`);
}

/**
 * Tell wagmi which chains you want to support
 * To add a new chain simply import it and add it here
 * @see https://wagmi.sh/react/providers/configuring-chains
 */
const { chains, provider } = configureChains(
  [networks[VITE_NETWORK]],
  [
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY! }),
    publicProvider(),
  ],
);

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
  connectors,
  provider,
});
