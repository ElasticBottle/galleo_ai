"use client";
import { Button } from "@galleo/ui/components/ui/button";
import { Input } from "@galleo/ui/components/ui/input";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

export function AIDrafting() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const [draft, setDraft] = useState([
    "Hey there,",
    "Appreciate you reaching out!",
    "You'll probably want to file under Class 35 & 41 for your trademark.",
    "The filing fees should be around SGD 450.",
    "Let me know if you need any changes!",
    "Cheers,",
    "[Your Firm]",
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const refinedDraft = [
    "Dear Client,",
    "Thank you for your inquiry.",
    "After reviewing your request, we recommend filing under Classes 35 & 41 for proper trademark protection.",
    "The estimated filing fees for this application are SGD 450.",
    "Please let us know if you have any further questions.",
    "Best regards,",
    "[Your Firm]",
  ];

  const handleRefineDraft = () => {
    setIsGenerating(true);
    let index = 0;
    const interval = setInterval(() => {
      setDraft(refinedDraft.slice(0, index + 1));
      ++index;
      if (index === refinedDraft.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 200); // Slowed down a bit to make the line-by-line effect more visible
  };

  return (
    <div
      className="w-full space-y-6 rounded-md bg-muted p-6 shadow-sm"
      ref={containerRef}
    >
      <div className="space-y-3 rounded-md p-4 text-sm">
        {draft.map((text, idx) => (
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              duration: 0.5,
              delay: idx * 0.05,
              ease: "easeOut",
            }}
            className="whitespace-pre-wrap break-words leading-tight"
          >
            {text}
          </motion.p>
        ))}
      </div>
      <Input
        type="text"
        defaultValue="Please Be More Formal and Professional"
        readOnly
      />
      <Button
        type="button"
        onClick={handleRefineDraft}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? "Generating..." : "Prompt Galleo (Click Here!)"}
      </Button>
    </div>
  );
}
