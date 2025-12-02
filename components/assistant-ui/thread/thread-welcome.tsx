"use client";

import type { FC } from "react";
import { motion } from "motion/react";
import { Typewriter } from "motion-plus/react";

export type ThreadWelcomeProps = {
  heading?: string;
  subheading?: string;
};

export const ThreadWelcome: FC<ThreadWelcomeProps> = ({
  heading = "Find your verse",
  subheading = "Search Scripture by topic, feeling, or reference",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="aui-thread-welcome-root mx-auto flex w-full max-w-2xl flex-col items-center text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="aui-thread-welcome-message flex flex-col items-center gap-3"
      >
        <h1 className="aui-thread-welcome-heading font-semibold text-3xl md:text-4xl text-foreground tracking-tight">
          <Typewriter speed="fast" cursorClassName="bg-secondary-500">
            {heading}
          </Typewriter>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="aui-thread-welcome-subheading text-lg text-muted-foreground/80"
        >
          {subheading}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
