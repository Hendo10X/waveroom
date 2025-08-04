import { HomeNav } from "@/components/homenav";
import { Hero } from "@/components/hero";
export default function Home() {
  return (
    <div>
      <HomeNav />
      <div className="w-dvw h-[calc(100dvh-41px)] flex flex-col items-center justify-center ">
        <Hero />
      </div>
    </div>
  );
}
