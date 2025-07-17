import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

export interface Track {
  rank: number;
  name: string;
  artist: string;
  album: string;
  image: string;
  url: string;
}

export function ChartTable({ tracks }: { tracks: Track[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Song</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Album</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tracks.map((track) => (
          <TableRow className=" hover:cursor-pointer" key={track.rank}>
            <TableCell>{track.rank}</TableCell>
            <TableCell>
              <a href={track.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                {track.image && <img src={track.image} alt="cover" className="w-8 h-8 rounded" />}
                <span>{track.name}</span>
              </a>
            </TableCell>
            <TableCell className="font-dm-mono">{track.artist}</TableCell>
            <TableCell className="font-dm-mono">{track.album}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
