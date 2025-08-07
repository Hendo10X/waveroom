"use client";
import { HomeNav } from "@/components/homenav";
import { Hero } from "@/components/hero";
import { motion } from "motion/react";
export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div>
        <HomeNav />
        <div className="w-dvw h-[calc(100dvh-41px)] flex flex-col items-center justify-center ">
          <Hero />
        </div>
      </div>
    </motion.div>
  );
}
