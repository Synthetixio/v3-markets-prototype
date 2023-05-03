import PerpsMarketProxy from "../../deployments/synthetix-sandbox/local/perpsMarket/PerpsMarketProxy.json";
import CoreProxy from "../../deployments/synthetix-sandbox/local/synthetix/CoreProxy.json";
import AccountProxy from "../../deployments/synthetix-sandbox/local/perpsMarket/AccountProxy.json";
import SpotMarketProxy from "../../deployments/synthetix-sandbox/local/spotMarket/SpotMarketProxy.json";
import USDProxy from "../../deployments/synthetix-sandbox/local/synthetix/USDProxy.json";
import OracleVerifier from "../../deployments/synthetix-sandbox/local/spotMarket/OracleVerifierMock.json";

export const contracts = {
  SYNTHETIX: CoreProxy,
  PERPS_MARKET: PerpsMarketProxy,
  SPOT_MARKET: SpotMarketProxy,
  ACCOUNT_PROXY: AccountProxy,
  USD: USDProxy,
  OracleVerifier: OracleVerifier,
};
