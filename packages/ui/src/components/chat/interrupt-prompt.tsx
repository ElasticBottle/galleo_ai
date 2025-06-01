"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "../icon";

interface InterruptPromptProps {
  isOpen: boolean;
  close: () => void;
}

export function InterruptPrompt({ isOpen, close }: InterruptPromptProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ top: 0, filter: "blur(5px)" }}
          animate={{
            top: -40,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              filter: { type: "tween" },
            },
          }}
          exit={{ top: 0, filter: "blur(5px)" }}
          className="-translate-x-1/2 absolute left-1/2 flex overflow-hidden whitespace-nowrap rounded-full border bg-background py-1 text-center text-muted-foreground text-sm"
        >
          <span className="ml-2.5">Press Enter again to interrupt</span>
          <button
            className="mr-2.5 ml-1 flex items-center"
            type="button"
            onClick={close}
            aria-label="Close"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
