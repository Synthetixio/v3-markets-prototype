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
}

export enum StrategyType {
  ONCHAIN = 0,
  PYTH = 1,
}
