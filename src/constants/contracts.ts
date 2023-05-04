import LocalPerpsMarketProxy from "../../deployments/local/perpsMarket/PerpsMarketProxy.json";
import LocalCoreProxy from "../../deployments/local/synthetix/CoreProxy.json";
import LocalAccountProxy from "../../deployments/local/perpsMarket/AccountProxy.json";
import LocalSpotMarketProxy from "../../deployments/local/spotMarket/SpotMarketProxy.json";
import LocalUSDProxy from "../../deployments/local/synthetix/USDProxy.json";
import LocalOracleVerifier from "../../deployments/local/spotMarket/OracleVerifierMock.json";

import OptimismGoerliCoreProxy from "../../deployments/optimism-goerli/system/CoreProxy.json";
import OptimismGoerliSpotMarketProxy from "../../deployments/optimism-goerli/spotFactory/SpotMarketProxy.json";
import OptimismGoerliAccountProxy from "../../deployments/optimism-goerli/system/AccountProxy.json";
import OptimismGoerliUSDProxy from "../../deployments/optimism-goerli/system/USDProxy.json";

export const contracts = {
  local: {
    chainId: 13370,
    SYNTHETIX: LocalCoreProxy,
    PERPS_MARKET: LocalPerpsMarketProxy,
    SPOT_MARKET: LocalSpotMarketProxy,
    ACCOUNT_PROXY: LocalAccountProxy,
    USD: LocalUSDProxy,
    OracleVerifier: LocalOracleVerifier,
  },
  ["optimism-goerli"]: {
    chainId: 420,
    SYNTHETIX: OptimismGoerliCoreProxy,
    PERPS_MARKET: null,
    SPOT_MARKET: OptimismGoerliSpotMarketProxy,
    ACCOUNT_PROXY: OptimismGoerliAccountProxy,
    USD: OptimismGoerliUSDProxy,
    OracleVerifier: null,
  },
} as const;
