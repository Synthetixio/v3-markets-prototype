export enum OrderType {
  BUY = "BUY",
  SELL = "SELL",
  WRAP = "WRAP",
  UNWRAP = "UNWRAP",
}

export enum FeeType {
  FIXED = "FIXED",
  UTILIZATION = "UTILIZATION",
  SKEW_SCALE = "SKEW_SCALE",
  ASYNC_FIXED = "ASYNC_FIXED",
}

export enum StrategyType {
  ONCHAIN = 0,
  PYTH = 1,
}

export enum TransactionType {
  NULL,
  BUY,
  SELL,
  ASYNC_BUY,
  ASYNC_SELL,
  WRAP,
  UNWRAP,
}
