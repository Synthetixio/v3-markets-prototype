import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

const spotOptimismGoerli = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/rickk137/v3-markets-graph",
});

const spotOptimism = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/rickk137/snx-v3-market-op-mainnet",
});

export const spotClient = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "optimism",
    spotOptimism,
    spotOptimismGoerli,
  ),
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
