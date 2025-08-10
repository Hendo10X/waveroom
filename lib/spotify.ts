import { Buffer } from "buffer";

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
}

interface SpotifyPlaylist {
  id: string;
  owner: {
    id: string;
  };
}

interface SpotifyPlaylistItem {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
  };
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{ url: string }>;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
}

export async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "";
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

export async function getTopPlaylistId(accessToken: string): Promise<string> {
  const response = await fetch(
    "https://api.spotify.com/v1/search?q=Top%2050%20-%20Global&type=playlist&limit=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  if (!data.playlists || !Array.isArray(data.playlists.items)) {
    throw new Error("Spotify API did not return playlists as expected");
  }
  const playlists = data.playlists.items;
  const officialPlaylist = playlists.find(
    (playlist: SpotifyPlaylist) =>
      playlist && playlist.owner && playlist.owner.id === "spotify"
  );
  if (!officialPlaylist) {
    throw new Error("Official Top 50 - Global playlist not found");
  }
  return officialPlaylist.id;
}

export async function getTopTracks(
  accessToken: string,
  playlistId: string
): Promise<Track[]> {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=20`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.items.map((item: SpotifyPlaylistItem) => ({
    id: item.track.id,
    name: item.track.name,
    artist: item.track.artists
      .map((artist: { name: string }) => artist.name)
      .join(", "),
    album: item.track.album.name,
    image: item.track.album.images[0]?.url || "",
  }));
}

export async function getRecentReleases(accessToken: string): Promise<Track[]> {
  const response = await fetch(
    "https://api.spotify.com/v1/browse/new-releases?limit=20",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  if (!data.albums || !Array.isArray(data.albums.items)) {
    throw new Error("Spotify API did not return albums as expected");
  }
  // For each album, get the first track (requires another API call per album)
  const albums = data.albums.items;
  const tracks: Track[] = [];
  for (const album of albums as SpotifyAlbum[]) {
    // Fetch album tracks
    const albumTracksRes = await fetch(
      `https://api.spotify.com/v1/albums/${album.id}/tracks?limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const albumTracksData = await albumTracksRes.json();
    if (albumTracksData.items && albumTracksData.items.length > 0) {
      const t = albumTracksData.items[0] as SpotifyTrack;
      tracks.push({
        id: t.id,
        name: t.name,
        artist: t.artists.map((a: { name: string }) => a.name).join(", "),
        album: album.name,
        image: album.images[0]?.url || "",
      });
    }
  }
  return tracks;
}
