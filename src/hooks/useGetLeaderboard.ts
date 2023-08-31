import { useEffect, useState } from "react";

export const useGetLeaderboard = () => {
  const key = "k51qzi5uqu5dkeepx98f934hrkdnsqachwnz83zbccd1tkx0py487kqholcj5v";
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    fetch(
      "https://ipfs.synthetix.io:5001/api/v0/resolve?arg=/ipns/k51qzi5uqu5dkeepx98f934hrkdnsqachwnz83zbccd1tkx0py487kqholcj5v&recursive=true",
      {
        method: "POST",
      },
    ).then((data) =>
      data.json().then((data) => {
        console.log(data);
        fetch(
          `https://ipfs.synthetix.io:5001/api/v0/cat?arg=${data.Cid["/"]}`,
          {
            method: "POST",
          },
        ).then((response) => response.json().then((data) => console.log(data)));
      }),
    );
    import("../../Ranking.json").then((data) => {
      setJSON(data);
      setLoading(false);
    });
  }, []);

  return { data: json?.default, loading };
};
