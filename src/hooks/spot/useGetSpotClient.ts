import { useMemo } from "react";
import {
  spotOptimismClient,
  spotBaseGoerliClient,
  spotOptimismGoerliClient,
} from "../../utils/clients";
import { useDefaultNetwork } from "../useDefaultNetwork";

export const useGetSpotClient = () => {
  const network = useDefaultNetwork();

  const client = useMemo(() => {
    switch (network.id) {
      case 10:
        return spotOptimismClient;
      case 420:
        return spotOptimismGoerliClient;
      case 84531:
        return spotBaseGoerliClient;

      default:
        return spotBaseGoerliClient;
    }
  }, [network.id]);

  return client;
};
