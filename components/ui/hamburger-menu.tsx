"use client";

import { motion } from "motion/react";
import { Button } from "./button";
import Link from "next/link";
import { TextThemeToggle } from "./text-theme-toggle";

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function HamburgerMenu({ isOpen, onToggle }: HamburgerMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex flex-col justify-center items-center w-8 h-8 cursor-pointer z-50"
        aria-label="Toggle menu">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-0.5 bg-foreground block mb-1.5"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-0.5 bg-foreground block mb-1.5"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-0.5 bg-foreground block"
        />
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        onClick={onToggle}
      />

      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={
          isOpen
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: -20, scale: 0.95 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}>
        <div className="py-2">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-dm-mono tracking-tightest uppercase text-muted-foreground">
              Menu
            </h3>
          </div>

          <div className="py-2">
            <TextThemeToggle />
            <Link
              href="/news"
              className="block px-4 py-3 text-sm font-dm-mono tracking-tightest uppercase text-foreground hover:bg-muted transition-colors">
              News
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 text-sm font-dm-mono tracking-tightest uppercase text-foreground hover:bg-muted transition-colors">
              About us
            </Link>
            <Link
              href="/faqs"
              className="block px-4 py-3 text-sm font-dm-mono tracking-tightest uppercase text-foreground hover:bg-muted transition-colors">
              FAQs
            </Link>
          </div>

          <div className="px-4 py-3 border-t border-border">
            <div className="flex flex-col gap-2">
              <Button className="w-full bg-background text-foreground font-dm-mono tracking-tightest uppercase text-sm px-4 py-2 hover:bg-muted">
                <Link href="/signup">Sign up</Link>
              </Button>
              <Button className="w-full bg-muted text-foreground font-dm-mono tracking-tightest uppercase text-sm hover:bg-muted/80 px-4 py-2 rounded-full">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
