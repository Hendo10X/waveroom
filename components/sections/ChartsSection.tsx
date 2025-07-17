"use client";
import { useEffect, useState, useCallback } from "react";
import { getAccessToken, getRecentReleases } from "@/lib/spotify";
import { ChartTable, Track } from "./ChartTable";

export function ChartsSection() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const recentTracks = await getRecentReleases(accessToken);
      // Add rank and url for ChartTable
      const transformedTracks: Track[] = recentTracks.map((track, index) => ({
        ...track,
        rank: index + 1,
        url: `https://open.spotify.com/track/${track.id}`,
      }));
      setTracks(transformedTracks);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
      setError("Failed to load recent releases.");
    }
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Set up polling for real-time updates (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTracks();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchTracks]);

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col gap-4 ml-2 md:ml-7">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Recent Releases</h2>
        {lastUpdated && (
          <div className="text-sm text-muted-foreground">
            Last updated: {formatLastUpdated(lastUpdated)}
          </div>
        )}
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && <ChartTable tracks={tracks} />}
    </div>
  );
}