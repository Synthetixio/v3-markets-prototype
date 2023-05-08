import { useEffect, useState } from "react";
import { useBlockNumber, useProvider } from "wagmi";

export const useGetBlock = () => {
  const [timestamp, setBlockTimeStamp] = useState(0);
  const { data: blockNumber } = useBlockNumber();
  const provider = useProvider();

  useEffect(() => {
    (async () => {
      const block = await provider.getBlock("latest");
      setBlockTimeStamp(block.timestamp);
    })();
  }, [blockNumber]);

  return {
    blockNumber,
    timestamp,
  };
};
