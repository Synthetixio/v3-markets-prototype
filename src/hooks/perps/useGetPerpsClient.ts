import { useMemo } from "react";
import {
  perpsBaseGoerliClient,
  perpsOptimismGoerliClient,
} from "../../utils/clients";
import { useDefaultNetwork } from "../useDefaultNetwork";

export const useGetPerpsClient = () => {
  const network = useDefaultNetwork();

  const client = useMemo(() => {
    switch (network.id) {
      case 420:
        return perpsOptimismGoerliClient;
      case 84531:
        return perpsBaseGoerliClient;

      default:
        return perpsBaseGoerliClient;
    }
  }, [network.id]);

  return client;
};
