"use client";
import { Spacer } from "@galleo/ui/components/ui/spacer";
import { Cta } from "./_components/cta";
import { AIDrafting } from "./_components/feature/ai-drafting";
import { FeatureSection } from "./_components/feature/container";
import { Email } from "./_components/feature/email";
import { Integrated } from "./_components/feature/integrated";
import { Security } from "./_components/feature/security";
import { Hero } from "./_components/hero";
import { Logos } from "./_components/logos";
import { Section } from "./_components/section";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Spacer className="h-12 md:h-60" />
      <Hero />
      <Spacer className="md:h-60" />
      <Section subtitle="Built by IP professionals, powered by AI">
        <div className="mx-auto max-w-md text-center text-muted-foreground">
          <p>
            Built by Silicon Valley AI experts and IP lawyers, Galleo seamlessly
            integrates AI into trademark filing—powering the future of IP
            practice.
          </p>
        </div>
        <Spacer className="h-8 md:h-10" />
        <Logos />
      </Section>

      <Spacer className="h-20 md:h-24" />
      <FeatureSection
        label=""
        title="Instantly drafted enquiry responses"
        description={
          <div className="space-y-4">
            <p>
              Leave manual drafting behind—Galleo analyses queries and generates
              replies in seconds. Simply review & send.
            </p>
            <div className="space-y-2">
              <p>Galleo's draft includes:</p>
              <ul className="ml-4 list-disc space-y-1 text-muted-foreground/80">
                <li>Integrated client research for smarter responses</li>
                <li>Recommended NICE classifications</li>
                <li>Automatically calculated fee estimates</li>
                <li>Follow-up requests customised for each client</li>
              </ul>
            </div>
          </div>
        }
        ctaText=""
        showcaseContent={<Email />}
      />

      <Spacer className="h-20 md:h-24" />

      <FeatureSection
        label=""
        title="Effortless drafting, always in your control"
        description={
          <div className="space-y-4">
            <p>
              Save time without sacrificing quality—Galleo drafts replies in
              your style for consistent, professional client interactions. Need
              changes? Just prompt Galleo to refine or edit the draft in
              seconds.
            </p>
            <ul className="ml-4 list-disc space-y-1 text-muted-foreground/80 ">
              <li>Smart, personalised drafting </li>
              <li>Customisable content incorporating your templates </li>
              <li>Prompt Galleo to refine tone & wording instantly </li>
            </ul>
          </div>
        }
        ctaText=""
        showcaseContent={<AIDrafting />}
        position="left"
      />

      <Spacer className="h-20 md:h-24" />

      <FeatureSection
        label=""
        title="Your AI-powered associate—right in your inbox"
        description={
          <div className="space-y-4">
            <p>
              Galleo works like a digital first-year associate, saving you hours
              by handling trademark tasks instantly—all within Outlook. No extra
              tools, no disruptions.
            </p>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground/80">
              <li>Direct Outlook integration, sent instantly to your drafts</li>
              <li>Works whenever, wherever you are</li>
            </ul>
          </div>
        }
        ctaText=""
        showcaseContent={<Integrated />}
      />

      <Spacer className="h-20 md:h-24" />

      <FeatureSection
        label="Features"
        title="Your data, fully protected"
        description={
          <div className="space-y-4">
            <p>
              Galleo keeps your information secure with encryption at every
              step. No data storage, no unnecessary access—complete privacy and
              control.
            </p>
            <ul className="ml-4 list-disc space-y-1 text-muted-foreground/80 ">
              <li>End-to-end encryption </li>
              <li>No data storage </li>
              <li>
                Strict access control
                <p className="mt-1 text-sm">
                  Galleo only reads the emails you select for drafting, ensuring
                  complete privacy and control.
                </p>
              </li>
            </ul>
          </div>
        }
        ctaText=""
        showcaseContent={<Security />}
        position="left"
      />

      <Spacer className="h-20 md:h-24" />

      <Cta />
      <Spacer className="h-20 md:h-24" />
    </div>
  );
}
