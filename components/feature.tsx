import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export const Feature2 = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="w-full py-8 lg:py-16 bg-background font-inter">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="flex gap-4 py-12 md:py-20 lg:py-40 flex-col items-start px-4 md:px-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}>
              <Badge className="bg-[#A2EE2F] text-[#243C00] text-sm md:text-base font-dm-mono tracking-tightest uppercase">
                Features
              </Badge>
            </motion.div>
            <motion.div
              className="flex gap-2 flex-col"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}>
              <h2 className="text-2xl sm:text-3xl md:text-5xl tracking-tighter max-w-full lg:max-w-xl font-regular">
                What makes us different
              </h2>
              <p className="text-base md:text-lg max-w-full lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
                We&apos;re not just another music platform. We&apos;re a
                community of music lovers who want to share their music with the
                world.
              </p>
            </motion.div>
            <div className="flex gap-6 md:gap-10 pt-8 md:pt-12 flex-col w-full">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 items-start lg:grid-cols-3 gap-6 md:gap-10"
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>
                <motion.div
                  className="flex flex-row gap-4 md:gap-6 w-full items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}>
                  <Check className="w-4 h-4 mt-1 md:mt-2 text-primary flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm md:text-base font-medium">
                      Curated playlists
                    </p>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      We&apos;ve curated playlists for you to enjoy.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex flex-row gap-4 md:gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}>
                  <Check className="w-4 h-4 mt-1 md:mt-2 text-primary flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm md:text-base font-medium">
                      Community
                    </p>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      We&apos;re a community of music lovers who want to share
                      their music with the world.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex flex-row gap-4 md:gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}>
                  <Check className="w-4 h-4 mt-1 md:mt-2 text-primary flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm md:text-base font-medium">
                      Personalized
                    </p>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      We&apos;re personalized to you.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex flex-row gap-4 md:gap-6 w-full items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}>
                  <Check className="w-4 h-4 mt-1 md:mt-2 text-primary flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm md:text-base font-medium">Discover</p>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      We&apos;ve made it easy to discover new music.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex flex-row gap-4 md:gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}>
                  <Check className="w-4 h-4 mt-1 md:mt-2 text-primary flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm md:text-base font-medium">Share</p>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      We&apos;ve made it easy to share your music with the
                      world.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex flex-row gap-4 md:gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}>
                  <Check className="w-4 h-4 mt-1 md:mt-2 text-primary flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm md:text-base font-medium">Create</p>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      We&apos;ve made it easy to create your own playlists.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
