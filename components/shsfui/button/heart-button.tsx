"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { getLikeCount, hasUserLiked, toggleLike } from "@/lib/post";
import { authClient } from "@/lib/auth-client";

type HeartButtonProps = React.ComponentProps<"button"> & {
  postId?: string;
  initialCount?: number;
  initialClickCount?: number;
  maxClicks?: number;
  label?: string;
  onHeartComplete?: () => void;
  onCountChange?: (count: number) => void;
};

const HeartButton = React.forwardRef<HTMLButtonElement, HeartButtonProps>(
  (props, ref) => {
    const {
      className,
      postId,
      initialCount = 0,
      initialClickCount = 0,
      maxClicks = 1,

      onHeartComplete,
      onCountChange,
      ...restProps
    } = props;

    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;
    const [mounted, setMounted] = React.useState(false);
    const [clickCount, setClickCount] = React.useState(initialClickCount);
    const [count, setCount] = React.useState(initialCount);

    React.useEffect(() => setMounted(true), []);

    React.useEffect(() => {
      if (!mounted || !postId) return;
      async function fetchLikeData() {
        const likeCount = await getLikeCount(postId || "");
        setCount(likeCount);
        if (userId) {
          const hasLiked = await hasUserLiked(postId || "", userId);
          setClickCount(hasLiked ? 1 : 0);
        }
      }
      fetchLikeData();
    }, [postId, userId, mounted]);

    const isCompleted = clickCount >= maxClicks;
    const fillPercentage = Math.min(100, (clickCount / maxClicks) * 100);
    const isActive = clickCount > 0;
    const sizeMultiplier = 1 + clickCount * 0.04;

    const animations = {
      count: {
        initial: { y: -20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 20, opacity: 0 },
      },
      heart: {
        initial: { scale: 1 },
        tapActive: { scale: 0.8 },
        tapCompleted: { scale: 1 },
      },
      particle: (index: number) => ({
        initial: { x: "50%", y: "50%", scale: 0, opacity: 0 },
        animate: {
          x: `calc(50% + ${Math.cos((index * Math.PI) / 3) * 30}px)`,
          y: `calc(50% + ${Math.sin((index * Math.PI) / 3) * 30}px)`,
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        },
        transition: { duration: 0.8, delay: index * 0.05, ease: "easeOut" },
      }),
      glow: {
        initial: { scale: 1, opacity: 0 },
        animate: { scale: [1, 1.5], opacity: [0.8, 0] },
        transition: { duration: 0.8, ease: "easeOut" as const },
      },
      pulse: {
        initial: { scale: 1.2, opacity: 0 },
        animate: { scale: [1.2, 1.8, 1.2], opacity: [0, 0.3, 0] },
        transition: { duration: 1.2, ease: "easeInOut" as const },
      },
    };

    const handleClick = async () => {
      if (!userId || !postId) return;

      if (clickCount < maxClicks) {
        const newClickCount = clickCount + 1;
        const newCount = count + 1;

        setClickCount(newClickCount);
        setCount(newCount);

        if (onCountChange) {
          onCountChange(newCount);
        }

        if (newClickCount === maxClicks && onHeartComplete) {
          onHeartComplete();
        }

        try {
          await toggleLike(postId, userId);
        } catch {
          // Revert on error
          setClickCount(clickCount);
          setCount(count);
        }
      } else {
        // Unlike
        const newClickCount = clickCount - 1;
        const newCount = count - 1;

        setClickCount(newClickCount);
        setCount(newCount);

        if (onCountChange) {
          onCountChange(newCount);
        }

        try {
          await toggleLike(postId, userId);
        } catch {
          // Revert on error
          setClickCount(clickCount);
          setCount(count);
        }
      }
    };

    if (!mounted) return null;

    return (
      <div className="relative">
        <button
          ref={ref}
          className={cn(
            "flex items-center gap-2 transition-colors hover:text-red-500",
            isActive ? "text-red-500" : "text-muted-foreground",
            className
          )}
          onClick={handleClick}
          disabled={!userId}
          aria-pressed={isActive}
          type="button"
          {...restProps}>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isActive ? sizeMultiplier : 1 }}
            whileTap={
              isCompleted
                ? animations.heart.tapCompleted
                : animations.heart.tapActive
            }
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative">
            <Heart className="opacity-60" size={16} aria-hidden="true" />

            <Heart
              className="absolute inset-0 text-red-500 fill-red-500 transition-all duration-300"
              size={16}
              aria-hidden="true"
              style={{ clipPath: `inset(${100 - fillPercentage}% 0 0 0)` }}
            />

            <AnimatePresence>
              {isCompleted && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(239,68,68,0) 70%)",
                    }}
                    {...animations.pulse}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: "0 0 10px 2px rgba(239,68,68,0.6)" }}
                    {...animations.glow}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              variants={animations.count}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="text-xs font-medium">
              {count}
            </motion.span>
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {isCompleted && (
            <motion.div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-red-500"
                  initial={animations.particle(i).initial}
                  animate={animations.particle(i).animate}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

HeartButton.displayName = "HeartButton";

export { HeartButton };
