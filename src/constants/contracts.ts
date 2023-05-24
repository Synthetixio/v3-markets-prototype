import CannonPerpsMarketProxy from "../../deployments/cannon/perpsMarket/PerpsMarketProxy.json";
import CannonCoreProxy from "../../deployments/cannon/synthetix/CoreProxy.json";
import CannonSpotMarketProxy from "../../deployments/cannon/spotMarket/SpotMarketProxy.json";
import CannonUSDProxy from "../../deployments/cannon/synthetix/USDProxy.json";
import CannonOracleVerifier from "../../deployments/cannon/spotMarket/OracleVerifierMock.json";
import CannonPerpsAccountProxy from "../../deployments/cannon/perpsMarket/AccountProxy.json";

import OptimismGoerliPerpsMarketProxy from "../../deployments/optimism-goerli/perpsFactory/PerpsMarketProxy.json";
import OptimismGoerliCoreProxy from "../../deployments/optimism-goerli/system/CoreProxy.json";
import OptimismGoerliSpotMarketProxy from "../../deployments/optimism-goerli/spotFactory/SpotMarketProxy.json";
import OptimismGoerliPerpsAccountProxy from "../../deployments/optimism-goerli/perpsFactory/AccountProxy.json";
import OptimismGoerliUSDProxy from "../../deployments/optimism-goerli/system/USDProxy.json";

import IPythVerifier from "../constants/IPythVerifier.json";

export const contracts = {
  cannon: {
    chainId: 13370,
    SYNTHETIX: CannonCoreProxy,
    PERPS_MARKET: CannonPerpsMarketProxy,
    SPOT_MARKET: CannonSpotMarketProxy,
    PERPS_ACCOUNT_PROXY: CannonPerpsAccountProxy,
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
    OracleVerifier: {
      address: "0xff1a0f4744e8582DF1aE09D5611b887B6a12925C",
      abi: IPythVerifier,
    },
  },
} as const;
