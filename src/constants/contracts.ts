import CannonPerpsMarketProxy from "../../deployments/cannon/perpsMarket/PerpsMarketProxy.json";
import CannonCoreProxy from "../../deployments/cannon/synthetix/CoreProxy.json";
import CannonAccountProxy from "../../deployments/cannon/perpsMarket/AccountProxy.json";
import CannonSpotMarketProxy from "../../deployments/cannon/spotMarket/SpotMarketProxy.json";
import CannonUSDProxy from "../../deployments/cannon/synthetix/USDProxy.json";
import CannonOracleVerifier from "../../deployments/cannon/spotMarket/OracleVerifierMock.json";

import OptimismGoerliPerpsMarketProxy from "../../deployments/optimism-goerli/perpsFactory/PerpsMarketProxy.json";
import OptimismGoerliCoreProxy from "../../deployments/optimism-goerli/system/CoreProxy.json";
import OptimismGoerliSpotMarketProxy from "../../deployments/optimism-goerli/spotFactory/SpotMarketProxy.json";
import OptimismGoerliPerpsAccountProxy from "../../deployments/optimism-goerli/perpsFactory/AccountProxy.json";
import OptimismGoerliUSDProxy from "../../deployments/optimism-goerli/system/USDProxy.json";

export const contracts = {
  cannon: {
    chainId: 13370,
    SYNTHETIX: CannonCoreProxy,
    PERPS_MARKET: CannonPerpsMarketProxy,
    SPOT_MARKET: CannonSpotMarketProxy,
    ACCOUNT_PROXY: CannonAccountProxy,
    USD: CannonUSDProxy,
    OracleVerifier: CannonOracleVerifier,
  },
  ["optimism-goerli"]: {
    chainId: 420,
    SYNTHETIX: OptimismGoerliCoreProxy,
    PERPS_MARKET: OptimismGoerliPerpsMarketProxy,
    SPOT_MARKET: OptimismGoerliSpotMarketProxy,
    PERPS_ACCOUNT_PROXY: OptimismGoerliPerpsAccountProxy,
    USD: OptimismGoerliUSDProxy,
    OracleVerifier: null,
  },
} as const;
