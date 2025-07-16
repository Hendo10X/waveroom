"use client";
import { useEffect, useState } from "react";
//import { getSpotifyTopTracks } from "@/lib/spotify";
import { ChartTable, Track } from "./ChartTable";

export function ChartsSection() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      setLoading(true);
      setError(null);
      try {
        //const data = await getSpotifyTopTracks();
        //setTracks(data);
      } catch (e) {
        setError("Failed to load top tracks.");
      }
      setLoading(false);
    }
    fetchTracks();
  }, []);

  return (
    <div className="flex flex-col gap-4 ml-2 md:ml-7">
      <h2 className="text-lg font-bold mb-4">Top Songs</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && <ChartTable tracks={tracks} />}
    </div>
  );
}