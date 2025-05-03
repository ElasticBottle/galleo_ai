"use client";

import { Play, X } from "@galleo/ui/components/icon";
import { cn } from "@galleo/ui/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

export function ImageWithVideo({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: {
  animationStyle?: AnimationStyle;
  videoSrc?: string | undefined;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
}) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];
  const Component = videoSrc ? "button" : "div";
  return (
    <div className={cn("relative", className)}>
      <Component
        type="button"
        className="group relative rounded-md p-2 ring-1 ring-slate-200/50 backdrop-blur-md dark:bg-gray-900/70 dark:ring-white/10"
        onClick={() => {
          if (videoSrc) {
            setIsVideoOpen(true);
          }
        }}
      >
        <Image
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1024}
          height={720}
          data-has-video={!!videoSrc}
          className="rounded-md border transition-all duration-200 ease-out data-[has-video=true]:group-hover:brightness-[0.8]"
        />
        {videoSrc && (
          <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
            <div className="z-30 flex size-28 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md">
              <div className="relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b from-primary/30 to-primary shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]">
                <Play
                  className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                  style={{
                    filter:
                      "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Component>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
            >
              <motion.button className="-top-16 absolute right-0 rounded-full bg-neutral-900/50 p-2 text-white text-xl ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black">
                <X className="size-5" />
              </motion.button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
                <iframe
                  src={videoSrc}
                  title="Hero Video"
                  className="size-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
