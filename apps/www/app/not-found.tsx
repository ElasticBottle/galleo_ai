"use client";

import { buttonVariants } from "@galleo/ui/components/ui/button";
import { cn } from "@galleo/ui/utils/cn";
import { motion } from "motion/react";
import Link from "next/link";
import { ROUTE_HOME } from "~/lib/routes";
import { ease } from "./(marketing)/_components/hero/constant";

export default function NotFound() {
  return (
    <div className="container relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center">
      <motion.div
        className="mx-auto flex max-w-xl flex-col items-center justify-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <h1 className="font-medium text-6xl sm:text-7xl">404</h1>
        <h2 className="mt-4 font-medium text-2xl sm:text-3xl">
          Page Not Found
        </h2>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. Please check the
          URL or return to the homepage.
        </p>
        <Link
          href={ROUTE_HOME}
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-8 flex gap-2",
          )}
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
