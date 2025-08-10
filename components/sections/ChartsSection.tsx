"use client";
import { useEffect, useState, useCallback } from "react";
import { getAccessToken, getRecentReleases } from "@/lib/spotify";
import { ChartTable, Track } from "./ChartTable";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

function TrackCardSkeleton() {
  return (
    <div className="flex flex-col items-center bg-background rounded-lg p-3 gap-2 border border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col items-center gap-2 w-full">
        <Skeleton className="w-16 h-16 rounded mb-1" />
        <Skeleton className="h-4 w-full max-w-[120px]" />
        <Skeleton className="h-3 w-full max-w-[100px]" />
        <Skeleton className="h-3 w-full max-w-[80px]" />
      </div>
      <Skeleton className="h-3 w-6 mt-1" />
    </div>
  );
}

function TrackCard({ track }: { track: Track }) {
  return (
    <div className="flex flex-col items-center bg-background rounded-lg  p-3 gap-2 border border-neutral-200 dark:border-neutral-800">
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 w-full">
        {track.image && (
          <Image
            src={track.image}
            alt="cover"
            width={64}
            height={64}
            className="w-16 h-16 rounded mb-1"
          />
        )}
        <span className="font-semibold text-sm text-center truncate w-full">
          {track.name}
        </span>
        <span className="font-dm-mono text-xs text-muted-foreground truncate w-full text-center">
          {track.artist}
        </span>
        <span className="font-dm-mono text-xs text-muted-foreground truncate w-full text-center">
          {track.album}
        </span>
      </a>
      <span className="text-xs text-muted-foreground mt-1">#{track.rank}</span>
    </div>
  );
}

function ChartTableSkeleton() {
  return (
    <div className="overflow-x-auto -mx-1 sm:mx-0">
      <div className="min-w-full border rounded-lg">
        {/* Table Header */}
        <div className="bg-muted/50 border-b">
          <div className="grid grid-cols-4 gap-4 px-4 py-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        {/* Table Body */}
        <div className="divide-y">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3">
              <Skeleton className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 ml-1 sm:ml-2 md:ml-7 px-1 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1 sm:gap-0">
        <h2 className="text-base sm:text-lg font-bold">Recent Releases</h2>
        {lastUpdated && (
          <div className="text-xs sm:text-sm text-muted-foreground">
            Last updated: {formatLastUpdated(lastUpdated)}
          </div>
        )}
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <>
          {/* Mobile skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:hidden w-full">
            {[...Array(6)].map((_, i) => (
              <TrackCardSkeleton key={i} />
            ))}
          </div>
          {/* Desktop skeleton */}
          <div className="hidden sm:block">
            <ChartTableSkeleton />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:hidden w-full">
            {tracks.map((track) => (
              <TrackCard key={track.rank} track={track} />
            ))}
          </div>
          <div className="overflow-x-auto -mx-1 sm:mx-0 hidden sm:block">
            <ChartTable tracks={tracks} />
          </div>
        </>
      )}
    </div>
  );
}
