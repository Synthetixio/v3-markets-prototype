import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

const optimismGoerli = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/rickk137/v3-markets-graph",
});

const optimism = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/rickk137/snx-v3-market-op-mainnet",
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "optimism",
    optimism,
    optimismGoerli,
  ),

  cache: new InMemoryCache(),
});
