"use client";

import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-7xl font-bebas-neue text-center leading-tightest tracking-tightest">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="block">
          join the wave,
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="block">
          enjoy the playlists,
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="block">
          join the bant!
        </motion.span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="text-lg font-inter text-center break-words w-1/2 mt-4 text-muted-foreground">
        Waveroom gives you the ability to find music friends, surf the charts
        and share your well curated playlists.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}>
        <Button className="mt-4 rounded-full hover:bg-[#A2EE2F]/80 bg-[#A2EE2F] text-[#243C00] font-inter font-semibold flex flex-row items-center gap-2 px-6 py-4 cursor-pointer">
          Get Started
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}>
            <ArrowRightIcon className="w-4 h-4" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
