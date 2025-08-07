"use client";

import Image from "next/image";
import Waveroom from "@/public/Waveroom.svg";
import { Button } from "./ui/button";
import Vercel from "./ui/vercel";
import { HamburgerMenu } from "./ui/hamburger-menu";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function HomeNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-background">
      <div className="flex items-center gap-4">
        <Image src={Waveroom} alt="Waveroom" width={100} height={100} />
      </div>
      <div className="hidden md:flex items-center gap-4">
        <Vercel />
      </div>

      <div className="hidden md:flex items-center gap-2 font-dm-mono tracking-tightest uppercase">
        <Button className="bg-background text-foreground font-dm-mono tracking-tightest uppercase text-xs sm:text-sm px-4 py-2 hover:bg-transparent hover:underline">
          <Link href="/signup">Sign up</Link>
        </Button>
        <Button className="bg-muted text-foreground font-dm-mono tracking-tightest uppercase text-xs sm:text-sm hover:bg-muted/80 px-4 py-2 rounded-full">
          <Link href="/login">Login</Link>
        </Button>
        <ThemeToggle />
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <HamburgerMenu isOpen={isMenuOpen} onToggle={toggleMenu} />
      </div>
    </div>
  );
}
