interface MarketData {
  [key: number]: {
    [key: string]: {
      marketId: number;
      tradingViewSymbol: string;
      synth?: string;
    };
  };
}

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
    LINK: {
      marketId: 3,
      tradingViewSymbol: "PYTH:LINKUSD",
      synth: "snxLINK",
    },
    OP: {
      marketId: 4,
      tradingViewSymbol: "PYTH:OPUSD",
      synth: "snxOP",
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
