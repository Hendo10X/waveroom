import Image from "next/image";
import Waveroom from "@/public/Waveroom.svg";
import { Button } from "./ui/button";

export function HomeNav() {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <Image src={Waveroom} alt="Waveroom" width={80} height={80} />
      </div>
      <div className="flex items-center gap-8 ml-0 text-white text-sm font-dm-mono tracking-tightest uppercase">
        <p className="hover:underline cursor-pointer">News</p>
        <p className="hover:underline cursor-pointer">FAQs</p>
        <p className="hover:underline cursor-pointer">About</p>
      </div>
      <div className="flex items-center gap-4">
        <a href="/signup" className="hover:underline cursor-pointer">
          <p className="text-white text-sm font-dm-mono tracking-tightest hover:underline cursor-pointer uppercase">
            Sign up
          </p>
        </a>
        <Button
          variant="outline"
          className="bg-[#1E1E1E] rounded-full px-4 py-2 text-white border-none text-sm font-dm-mono tracking-tightest uppercase">
          <a href="/login">Login</a>
        </Button>
      </div>
    </div>
  );
}
