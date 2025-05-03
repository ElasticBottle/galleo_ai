"use client";

import { motion } from "motion/react";

export function Security() {
  return (
    <div className="relative flex h-96 w-full items-center justify-center rounded-xl bg-black shadow-2xl">
      {/* Outer Cyber Security Rings */}
      <motion.div
        className="absolute h-96 w-96 rounded-full border-[5px] border-blue-500 opacity-30"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute h-72 w-72 rounded-full border-[3px] border-blue-400 opacity-50"
        animate={{ rotate: [0, 20, -20, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 5,
          ease: "easeInOut",
        }}
      />

      {/* Simple Glowing Circle */}
      <motion.div
        className="relative z-10 h-20 w-20 rounded-full border-[5px] border-white bg-blue-500 shadow-lg"
        animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.1, 1] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        {/* Soft Glow */}
        <motion.div
          className="absolute h-24 w-24 rounded-full bg-blue-400 opacity-30 blur-lg"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
