import { motion } from "motion/react";
import { siteConfig } from "~/lib/site-config";
import { ease } from "./constant";

export function HeroTitle() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center space-y-4 overflow-hidden">
      <motion.h1
        className="text-center font-bold font-sans text-5xl text-foreground tracking-tight sm:text-6xl md:text-7xl"
        initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease,
          staggerChildren: 0.2,
        }}
      >
        {siteConfig.hero.title.map((text, index) => (
          <motion.span
            key={text}
            className={`inline-block text-balance px-1 font-bold leading-[1.1] tracking-tight md:px-2 ${
              index % 2 === 1 ? "text-primary" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.2,
              ease,
            }}
          >
            {text}
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        className="mx-auto max-w-xl text-balance text-center text-lg text-muted-foreground leading-7 sm:text-xl sm:leading-snug"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease,
        }}
      >
        {siteConfig.hero.description}
      </motion.p>
    </div>
  );
}
