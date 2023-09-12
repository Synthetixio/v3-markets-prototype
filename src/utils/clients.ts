import { ApolloClient, InMemoryCache } from "@apollo/client";

export const spotOptimismGoerliClient = new ApolloClient({
  uri: "https://subgraph.satsuma-prod.com/ce5e03f52f3b/synthetix/spot-market-optimism-goerli/api",
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});
export const spotBaseGoerliClient = new ApolloClient({
  uri: "https://subgraph.satsuma-prod.com/ce5e03f52f3b/synthetix/spot-market-base-goerli/api",
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});
export const spotOptimismClient = new ApolloClient({
  uri: "https://subgraph.satsuma-prod.com/ce5e03f52f3b/synthetix/spot-market-optimism-mainnet/api",
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const perpsClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/rickk137/v3-perps-opt-goerli",
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});
