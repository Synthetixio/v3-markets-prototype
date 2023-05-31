export enum FeeType {
  FIXED = "FIXED",
  UTILIZATION = "UTILIZATION",
  SKEW_SCALE = "SKEW_SCALE",
  ASYNC_FIXED = "ASYNC_FIXED",
}

export const StrategyType = {
  420: {
    ONCHAIN: 2,
    PYTH: 1,
  },
  10: {
    ONCHAIN: 0,
    PYTH: 1,
  },
} as const;

export enum TransactionType {
  NULL,
  BUY,
  SELL,
  ASYNC_BUY,
  ASYNC_SELL,
  WRAP,
  UNWRAP,
}
