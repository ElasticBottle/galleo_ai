import { motion } from "motion/react";
import { siteConfig } from "~/lib/site-config";
import { ease } from "./constant";
import { ImageWithVideo } from "./image-with-video";

export function HeroShowcase() {
  if (!siteConfig.hero.showcase) return null;

  return (
    <motion.div
      className="relative max-w-screen-lg rounded-lg border shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 1, ease }}
    >
      <ImageWithVideo
        animationStyle="from-center"
        videoSrc={siteConfig.hero.showcase.videoSrc}
        thumbnailSrc={siteConfig.hero.showcase.thumbnailSrc}
        thumbnailAlt={siteConfig.hero.showcase.thumbnailAlt}
      />
      <div className="-bottom-12 pointer-events-none absolute inset-x-0 h-1/3 bg-gradient-to-t from-background via-background to-transparent lg:h-1/4" />
    </motion.div>
  );
}
