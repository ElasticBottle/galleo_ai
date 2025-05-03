"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function Email() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const paragraphs = [
    "Hi Nick,",
    "Thank you for this introduction.",
    "We understand that the client would like to consider filing trade mark protection for a garden care project. You may wish to provide us with more information on the proposed mark(s) and goods/services offered so that we can review.",
    "From our own preliminary search, we found this website: https://example.com/",
    "If that is in order, we will proceed to conduct the relevant checks.",
    "Thank you!",
  ];

  return (
    <div
      className="relative w-full rounded-lg bg-background p-6 shadow-sm"
      ref={containerRef}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>To: Nick Thompson</span>
            <span>4:23 PM</span>
          </div>
          <div className="text-muted-foreground text-sm">
            Subject: Re: Introduction - Trademark Protection
          </div>
        </div>

        <div className="space-y-4 text-foreground text-sm">
          {paragraphs.map((text, index) => (
            <motion.p
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: 0.5,
                delay: index * 0.3,
                ease: "easeOut",
              }}
            >
              {text.includes("https://") ? (
                <>
                  From our own preliminary search, we found this website:{" "}
                  <span className="text-blue-600">https://example.com/</span>
                </>
              ) : (
                text
              )}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}
