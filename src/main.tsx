import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { WagmiConfig } from "wagmi";

// import { PerpsMarket } from "./pages/perps/PerpsMarket";
import { chains, client } from "./wagmi";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
// import { Index } from "./pages/Index";
// import { PerpsAdmin } from "./pages/perps/PerpsAdmin";
import { SpotMarket } from "./pages/spot/SpotMarket";
import { SpotAdmin } from "./pages/spot/SpotAdmin";

import { PerpsMarket } from "./pages/perps/PerpsMarket";
import Leaderboard from "./pages/Leaderboard";
import theme from "./theme";

import { QueryClient, QueryClientProvider } from "react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SpotMarket />,
  },
  // {
  //   path: "/perps/admin",
  //   element: <PerpsAdmin />,
  // },
  {
    path: "/perps/markets/:marketSymbol",
    element: <PerpsMarket />,
  },
  {
    path: "/perps/markets/:marketSymbol/:accountId",
    element: <PerpsMarket />,
  },
  {
    path: "/spot/admin",
    element: <SpotAdmin />,
  },
  {
    path: "/spot/markets/:marketId",
    element: <SpotMarket />,
  },
  { path: "/leaderboard", element: <Leaderboard /> },
]);

Object.defineProperty(BigInt.prototype, "toJSON", {
  get() {
    "use strict";
    return () => String(this);
  },
});

const queryClient = new QueryClient();

/**
 * Root providers and initialization of app
 * @see https://reactjs.org/docs/strict-mode.html
 * @see https://wagmi.sh/react/WagmiConfig
 * @see https://www.rainbowkit.com/docs/installation
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <WagmiConfig client={client}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: "#00a4c4",
            accentColorForeground: "#ffffff",
            borderRadius: "small",
          })}
        >
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  </React.StrictMode>,
);
