import PerpsMarketProxy from "../../deployments/perpsMarket/PerpsMarketProxy.json";
import CoreProxy from "../../deployments/synthetix/CoreProxy.json";
import AccountProxy from "../../deployments/perpsMarket/AccountProxy.json";
import SpotMarketProxy from "../../deployments/spotMarket/SpotMarketProxy.json";
import USDProxy from "../../deployments/synthetix/USDProxy.json";
import OracleVerifier from "../../deployments/spotMarket/OracleVerifierMock.json";

export const contracts = {
  SYNTHETIX: CoreProxy,
  PERPS_MARKET: PerpsMarketProxy,
  SPOT_MARKET: SpotMarketProxy,
  ACCOUNT_PROXY: AccountProxy,
  USD: USDProxy,
  OracleVerifier: OracleVerifier,
};
