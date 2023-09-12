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

import BaseGoerliPerpsMarketProxy from "../../deployments/base-goerli-competition/perpsFactory/PerpsMarketProxy.json";
import BaseGoerliCoreProxy from "../../deployments/base-goerli-competition/system/CoreProxy.json";
import BaseGoerliSpotMarketProxy from "../../deployments/base-goerli-competition/spotFactory/SpotMarketProxy.json";
import BaseGoerliPerpsAccountProxy from "../../deployments/base-goerli-competition/perpsFactory/PerpsAccountProxy.json";
import BaseGoerliUSDProxy from "../../deployments/base-goerli-competition/system/USDProxy.json";

import OptimismCoreProxy from "../../deployments/optimism/system/CoreProxy.json";
import OptimismSpotMarketProxy from "../../deployments/optimism/spotFactory/SpotMarketProxy.json";
import OptimismUSDProxy from "../../deployments/optimism/system/USDProxy.json";

import IPythVerifier from "../constants/IPythVerifier.json";

interface Contracts {
  [key: string]: {
    chainId: number;
    SYNTHETIX: any;
    PERPS_MARKET: any;
    SPOT_MARKET: any;
    PERPS_ACCOUNT_PROXY: any;
    USD: any;
    OracleVerifier: any;
  };
}

export const contracts: Contracts = {
  cannon: {
    chainId: 13370,
    SYNTHETIX: CannonCoreProxy,
    PERPS_MARKET: CannonPerpsMarketProxy,
    SPOT_MARKET: CannonSpotMarketProxy,
    PERPS_ACCOUNT_PROXY: CannonPerpsAccountProxy,
    USD: CannonUSDProxy,
    OracleVerifier: CannonOracleVerifier,
  },
  "optimism-goerli": {
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
  "base-goerli": {
    chainId: 420,
    SYNTHETIX: BaseGoerliCoreProxy,
    PERPS_MARKET: BaseGoerliPerpsMarketProxy,
    SPOT_MARKET: BaseGoerliSpotMarketProxy,
    PERPS_ACCOUNT_PROXY: BaseGoerliPerpsAccountProxy,
    USD: BaseGoerliUSDProxy,
    OracleVerifier: {
      address: "0x5955C1478F0dAD753C7E2B4dD1b4bC530C64749f",
      abi: IPythVerifier,
    },
  },
  optimism: {
    chainId: 1,
    SYNTHETIX: OptimismCoreProxy,
    PERPS_MARKET: null,
    SPOT_MARKET: OptimismSpotMarketProxy,
    PERPS_ACCOUNT_PROXY: null,
    USD: OptimismUSDProxy,
    OracleVerifier: {
      address: "0xff1a0f4744e8582DF1aE09D5611b887B6a12925C",
      abi: IPythVerifier,
    },
  },
} as const;
