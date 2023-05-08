interface MarketData {
  [key: string]: {
    marketId: number;
    tradingViewSymbol: string;
  };
}

export const perpsMarkets: MarketData = {
  ETH: {
    marketId: 2,
    tradingViewSymbol: "PYTH:ETHUSD",
  },
};

export const spotMarkets: MarketData = {
  BTC: {
    marketId: 1,
    tradingViewSymbol: "PYTH:BTCUSD",
  },
  ETH: {
    marketId: 2,
    tradingViewSymbol: "PYTH:ETHUSD",
  },
};
