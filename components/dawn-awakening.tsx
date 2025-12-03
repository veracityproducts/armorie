"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { LightRays } from "@/components/ui/light-rays";

interface DawnAwakeningProps {
  children: React.ReactNode;
}

export function DawnAwakening({ children }: DawnAwakeningProps) {
  const [isAwakening, setIsAwakening] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if this is a fresh login (sessionStorage clears on browser close)
    const hasAwakened = sessionStorage.getItem("armorie_awakened");

    if (!hasAwakened) {
      // First visit this session - play the awakening animation
      setIsAwakening(true);
      sessionStorage.setItem("armorie_awakened", "true");

      // After animation completes, show content
      const timer = setTimeout(() => {
        setIsAwakening(false);
        setShowContent(true);
      }, 3000); // 3 second dawn animation

      return () => clearTimeout(timer);
    } else {
      // Already awakened this session - show content immediately
      setShowContent(true);
    }
  }, []);

  return (
    <div className="relative h-full">
      {/* Dawn awakening overlay */}
      <AnimatePresence>
        {isAwakening && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Background image transitioning from faded to full color */}
            <motion.div
              className="absolute inset-0"
              initial={{ filter: "saturate(0.3) brightness(0.6)" }}
              animate={{ filter: "saturate(1) brightness(1)" }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            >
              <Image
                src="/background.webp"
                alt=""
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Light rays awakening effect - warm dawn colors */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <LightRays
                count={12}
                color="rgba(255, 200, 150, 0.25)"
                blur={48}
                speed={8}
                length="100vh"
              />
            </motion.div>

            {/* Second layer of cooler rays for depth */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
            >
              <LightRays
                count={8}
                color="rgba(180, 220, 255, 0.15)"
                blur={60}
                speed={12}
                length="90vh"
              />
            </motion.div>

            {/* Gradient overlay fading out */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-primary-950/60 via-transparent to-primary-950/40"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            />

            {/* Welcome message */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center">
                <motion.h1
                  className="text-4xl font-light text-white drop-shadow-lg tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 3, times: [0, 0.2, 0.7, 1] }}
                >
                  A new day begins
                </motion.h1>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
