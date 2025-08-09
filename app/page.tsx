"use client";
import { HomeNav } from "@/components/homenav";
import { Hero } from "@/components/hero";
import { motion } from "motion/react";
import { Feature2 } from "@/components/feature";
import { Faqs } from "@/components/Faqs";
import { Footer1 } from "@/components/ui/Footer";
//import { ThemeDebug } from "@/components/theme-debug";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div>
        {/* <ThemeDebug /> */}
        <HomeNav />
        <div className="w-dvw h-[calc(100dvh-41px)] flex flex-col items-center justify-center">
          <Hero />
        </div>
        <Feature2 />
        <Faqs />
        <Footer1 />
      </div>
    </motion.div>
  );
}
