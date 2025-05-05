"use client";
import { Spacer } from "@galleo/ui/components/ui/spacer";
import { Section } from "../section";
import { HeroCTA } from "./cta";
import { HeroShowcase } from "./showcase";
import { HeroTitle } from "./title";

export function Hero() {
  return (
    <Section id="hero" className=" px-8 sm:px-10 lg:px-12">
      <HeroTitle />
      <Spacer className="h-6" />
      <HeroCTA />
      <Spacer className="h-8 md:h-16" />
      <HeroShowcase />
    </Section>
  );
}
