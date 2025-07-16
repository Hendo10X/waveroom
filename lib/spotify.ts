/* // Replace these with your actual Spotify credentials
  const clientId = "b0c45719424b460b875cd70dcd3394b5";
  const clientSecret = "38525951033f4cd4a405505359e32d66";

console.log(clientId, clientSecret);
let accessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;
  console.log(accessToken)

  if (!clientId || !clientSecret) {
    console.error("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is missing.");
    throw new Error("Spotify credentials missing");
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to fetch access token", res.status, errorText);
    throw new Error("Failed to fetch access token: " + errorText);
  }

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000; // refresh 1 min early
  return accessToken;
}

export async function getSpotifyTopTracks() {
  const token = await getAccessToken();
  const playlistId = "37i9dQZEVXbMDoHDwVN2tF";
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}?limit=20`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.tracks?.items || []).slice(0, 20).map((item: any, i: number) => ({
    rank: i + 1,
    name: item.track.name,
    artist: item.track.artists.map((a: any) => a.name).join(", "),
    album: item.track.album.name,
    image: item.track.album.images?.[2]?.url || "",
    url: item.track.external_urls.spotify,
   
  }));
}
export async function getSpotifyTopArtists(country: string) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/charts/top-artists?country=${country}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.artists?.items || []).slice(0, 20).map((item: any, i: number) => ({
    rank: i + 1,
    name: item.name,
    image: item.images?.[2]?.url || "",
    url: item.external_urls.spotify,
  }));
}
*/