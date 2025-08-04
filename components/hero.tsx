import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-7xl font-bebas-neue text-center leading-tightest tracking-tightest">
        <span className="block">join the wave,</span>
        <span className="block">enjoy the playlists,</span>
        <span className="block">join the bant!</span>
      </h1>
      <p className="text-lg font-inter text-center break-words w-1/2 mt-4 text-muted-foreground">
        Waveroom gives you the ability to find music friends, surf the charts
        and share your well curated playlists.
      </p>
      <Button className="mt-4 rounded-full hover:bg-[#A2EE2F]/80 bg-[#A2EE2F] text-[#243C00] font-inter font-semibold flex flex-row items-center gap-2 px-6 py-4">
        Get Started
        <ArrowRightIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
