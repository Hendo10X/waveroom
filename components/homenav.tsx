import Image from "next/image";
import Waveroom from "@/public/Waveroom.svg";
import { Button } from "./ui/button";
import Vercel from "./ui/vercel";
import Link from "next/link";

export function HomeNav() {
  return (
    <div className="flex justify-between items-center p-4 bg-background">
      <div className="flex items-center gap-4">
        <Image src={Waveroom} alt="Waveroom" width={100} height={100} />
      </div>
      <Vercel />
      <div className="flex items-center gap-2 font-dm-mono tracking-tightest uppercase">
        <Button className="bg-background text-white font-dm-mono tracking-tightest uppercase text-sm px-4 py-2 hover:bg-background hover:text-white hover:underline">
          <Link href="/signup">Sign up</Link>
        </Button>
        <Button className="bg-[#1E1E1E] text-white font-dm-mono tracking-tightest uppercase text-sm hover:bg-background hover:text-white px-4 py-2 rounded-full">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
