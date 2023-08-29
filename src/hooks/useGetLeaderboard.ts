import { useEffect, useState } from "react";

export const useGetLeaderboard = () => {
  const [json, setJSON] = useState<{
    default: {
      lastUpdated: number;
      leaderboard: {
        rank: number;
        accountId: string;
        address: string;
        pnl_pct: number;
      }[];
    };
  } | null>(null);
  useEffect(() => {
    import("../../Ranking.json").then((data) => {
      setJSON(data);
    });
  }, []);

  return json?.default;
};
