import { useEffect, useState } from "react";

export const useGetLeaderboard = () => {
  const [loading, setLoading] = useState(false);
  const [json, setJSON] = useState<{
    lastUpdated: number;
    leaderboard: {
      rank: number;
      accountId: string;
      address: string;
      pnl_pct: number;
    }[];
  } | null>(null);

  useEffect(() => {
    setLoading(true);

    fetch(
      "https://ipfs.synthetix.io/ipns/k2k4r8lfgmmsal4y0yy8lt2rvr81mysatckaopta9s48n0rvjagy9ie9",
      {
        method: "GET",
      },
    )
      .then((data) => {
        data.json().then((data) => {
          setJSON(data);
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return { data: json, loading };
};
