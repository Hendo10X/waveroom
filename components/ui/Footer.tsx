import Link from "next/link";
import Waveroom from "@/public/Waveroom.svg";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  TwitterIcon,
  InstagramIcon,
  DiscordIcon,
  YoutubeIcon,
} from "hugeicons-react";

export const Footer1 = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const navigationLinks = [
    { title: "About Us", href: "/about" },
    { title: "News", href: "/news" },
    { title: "FAQs", href: "/faqs" },
    { title: "Terms", href: "/terms" },
    { title: "Privacy", href: "/privacy" },
  ];

  const socialLinks = [
    {
      title: "Twitter",
      href: "https://twitter.com/waveroom",
      icon: <TwitterIcon size={24} />,
    },
    {
      title: "Instagram",
      href: "https://instagram.com/waveroom",
      icon: <InstagramIcon size={24} />,
    },
    {
      title: "Discord",
      href: "https://discord.gg/waveroom",
      icon: <DiscordIcon size={24} />,
    },
    {
      title: "YouTube",
      href: "https://youtube.com/waveroom",
      icon: <YoutubeIcon size={24} />,
    },
  ];

  return (
    <div
      ref={ref}
      className="w-full py-12 md:py-16 bg-foreground text-background font-inter">
      <div className="container mx-auto px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex items-center gap-3">
            <Image
              src={Waveroom}
              alt="Waveroom"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <span className="text-lg md:text-xl font-dm-mono tracking-tightest uppercase">
              Waveroom
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-6 md:gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm md:text-base text-background/75 hover:text-background transition-colors font-dm-mono tracking-tightest uppercase">
                {link.title}
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="flex gap-4 md:gap-6">
            {socialLinks.map((social) => (
              <Link
                key={social.title}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-xl hover:scale-110 transition-transform"
                title={social.title}>
                {social.icon}
              </Link>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="mt-8 pt-8 border-t border-background/20 text-center">
          <p className="text-xs md:text-sm text-background/60 font-dm-mono tracking-tightest uppercase">
            © 2024 Waveroom. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
