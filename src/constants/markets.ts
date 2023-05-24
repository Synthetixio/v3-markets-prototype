interface MarketData {
  [key: string]: {
    marketId: number;
    tradingViewSymbol: string;
    synth?: string;
  };
}

export const perpsMarkets: MarketData = {
  ETH: {
    marketId: 2,
    tradingViewSymbol: "PYTH:ETHUSD",
    synth: "snxETH",
  },
};

export const spotMarkets: MarketData = {
  BTC: {
    marketId: 1,
    tradingViewSymbol: "PYTH:BTCUSD",
    synth: "snxBTC",
  },
  ETH: {
    marketId: 2,
    tradingViewSymbol: "PYTH:ETHUSD",
    synth: "snxETH",
  },
};
