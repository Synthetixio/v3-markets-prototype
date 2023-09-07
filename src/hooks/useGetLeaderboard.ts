import { useEffect, useState } from "react";

export const useGetLeaderboard = () => {
  const key = "k2k4r8lfgmmsal4y0yy8lt2rvr81mysatckaopta9s48n0rvjagy9ie9";
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

    // fetch(`https://ipfs.synthetix.io:5001/api/v0/name/resolve?key=${key}`, {
    //   method: "POST",
    //   headers: {
    //     Authorization:
    //       "Basic " + btoa("leaderboard" + ":" + "XDZ2cHeCNi4Zhtd6Qj"),
    //   },
    // }).then((data) => {
    //   data.json().then((data) => {
    //     fetch(
    //       `https://ipfs.synthetix.io:5001/api/v0/cat?arg=${
    //         data.Path.split("/")[2]
    //       }`,
    //       {
    //         method: "POST",
    //         headers: {
    //           Authorization:
    //             "Basic " + btoa("leaderboard" + ":" + "XDZ2cHeCNi4Zhtd6Qj"),
    //         },
    //       },
    //     ).then((response) => response.json().then((data) => console.log(data)));
    //   });
    // });

    fetch("https://data.gbv.dev/synthetix/data/competition_results.json").then(
      (data) =>
        data.json().then((json) => {
          console.log(json);
          setJSON(json);
          setLoading(false);
        }),
    );
  }, []);

  return { data: json?.default, loading };
};
