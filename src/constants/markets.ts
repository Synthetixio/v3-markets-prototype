interface MarketData {
  [key: number]: {
    [key: string]: {
      marketId: number;
      tradingViewSymbol: string;
      synth?: string;
    };
  };
}

export const perpsMarkets: MarketData = {
  84531: {
    ETH: {
      marketId: 5,
      tradingViewSymbol: "PYTH:ETHUSD",
      synth: "snxETH",
    },
  },
  420: {
    ETH: {
      marketId: 5,
      tradingViewSymbol: "PYTH:ETHUSD",
      synth: "snxETH",
    },
  },
  10: {},
};

export const spotMarkets: MarketData = {
  84531: {
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
  },
  420: {
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
    LINK: {
      marketId: 3,
      tradingViewSymbol: "PYTH:LINKUSD",
      synth: "snxLINK",
    },
  },
  10: {
    ETH: {
      marketId: 1,
      tradingViewSymbol: "PYTH:ETHUSD",
      synth: "snxETH",
    },
  },
};
