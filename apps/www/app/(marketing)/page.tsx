"use client";
import { Spacer } from "@galleo/ui/components/ui/spacer";
import { Cta } from "./_components/cta";
import { AIDrafting } from "./_components/feature/ai-drafting";
import { FeatureSection } from "./_components/feature/container";
import { Email } from "./_components/feature/email";
import { Integrated } from "./_components/feature/integrated";
import { Security } from "./_components/feature/security";
import { Hero } from "./_components/hero";
import { IntegrationSteps } from "./_components/integration-steps";
import { Logos } from "./_components/logos";
import { Section } from "./_components/section";

export default function LandingPage() {
  return (
    <div>
      <Spacer className="h-20 md:h-24" />
      <Hero />
      <Spacer className="h-20 md:h-24" />

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-bold font-sans text-4xl text-foreground tracking-tight sm:text-5xl">
            Your{" "}
            <span className="text-primary">Trademark Response Powerhouse</span>,
            Built by <span className="text-primary">IP Professionals</span>
          </h2>
          <div className="mb-8 text-muted-foreground">
            <p>
              Engineered by Silicon Valley AI experts and veteran IP attorneys,
              Galleo understands your pain points and transforms trademark
              inquiries into revenue opportunities without sacrificing quality
              or expertise.
            </p>
          </div>
        </div>
        <Logos />
      </Section>
      <Spacer className="h-20 md:h-24" />

      <FeatureSection
        label=""
        title={
          <>
            <span className="text-primary"> 2 Hours</span> of Drafting →{" "}
            <span className="text-primary">30 Seconds</span> with Galleo
          </>
        }
        description={
          <div className="space-y-4">
            <p className="font-bold text-lg">Trademark Enquiries? Done.</p>
            <p>
              Eliminate manual response drafting completely. Galleo analyzes
              client trademark inquiries and generates professional, complete
              responses instantly. Simply review and send.
            </p>
            <div className="space-y-2">
              <p className="font-bold">Every Automated Response Includes:</p>
              <ul className="ml-0 space-y-3 text-muted-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <title>Client research automatically integrated</title>
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Client research automatically integrated
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <title>Precise NICE classification recommendations</title>
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Precise NICE classification recommendations
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <title>Accurate, itemized fee calculations</title>
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Accurate, itemized fee calculations
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <title>
                        Customized follow-up requests tailored to your client
                      </title>
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Customized follow-up requests tailored to your client
                </li>
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
        title={
          <>
            <span className="text-primary">Effortless Drafting</span>, Always in{" "}
            <span className="text-primary">Your Control</span>
          </>
        }
        description={
          <div className="space-y-4">
            <p className="font-bold text-lg">Your AI Trademark Associate</p>
            <p>
              Maintain your quality standards while cutting hours from your
              workday. Galleo drafts trademark enquiry responses in your firm's
              style and voice, ensuring consistent client communications. Need
              adjustments? Simply prompt Galleo to refine any aspect instantly.
            </p>
            <div className="space-y-2">
              <p className="font-bold">Smart Drafting Features:</p>
              <ul className="ml-0 space-y-3 text-muted-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <title>
                        Firm-specific templates and trademark response patterns
                      </title>
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Firm-specific templates and trademark response patterns
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <title>
                        Customizable content that matches your brand voice
                      </title>
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Customizable content that matches your brand voice
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <title>Instant refinements with simple prompts</title>
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Instant refinements with simple prompts
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <title>
                        Consistent quality across all trademark communications
                      </title>
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Consistent quality across all trademark communications
                </li>
              </ul>
            </div>
          </div>
        }
        ctaText=""
        showcaseContent={<AIDrafting />}
        position="left"
      />

      <Spacer className="h-20 md:h-24" />

      <FeatureSection
        label=""
        title={
          <>
            <span className="text-primary">One Click in Outlook</span>. Full
            Enquiry Response.
          </>
        }
        description={
          <div className="space-y-4">
            <p className="font-bold text-lg">
              No New Tools. No Learning Curve.
            </p>
            <p>
              Galleo works directly within Outlook—like having a digital
              associate handling trademark enquiries instantly, available 24/7.
            </p>
            <ul className="ml-0 space-y-3 text-muted-foreground/80">
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <title>
                      Draft complete trademark responses with one click
                    </title>
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Draft complete trademark responses with one click
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <title>
                      Send finished drafts directly to your Outlook drafts
                      folder
                    </title>
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Send finished drafts directly to your Outlook drafts folder
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <title>
                      Available whenever clients enquire, wherever you work
                    </title>
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Available whenever clients enquire, wherever you work
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <title>
                      Zero learning curve—works in your existing email
                    </title>
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Zero learning curve—works in your existing email
              </li>
            </ul>
          </div>
        }
        ctaText=""
        showcaseContent={<Integrated />}
      />

      <Spacer className="h-20 md:h-24" />

      <FeatureSection
        label=""
        title={
          <>
            Your Data, <span className="text-primary">Fully Protected</span>
          </>
        }
        description={
          <div className="space-y-4">
            <p>
              Galleo keeps your information secure with encryption at every
              step. No data storage, no unnecessary access—complete privacy and
              control.
            </p>
            <ul className="ml-0 space-y-3 text-muted-foreground/80">
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <title>End-to-end encryption for all communications</title>
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                End-to-end encryption for all communications
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <title>
                      Zero data storage policy—information isn't retained
                    </title>
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Zero data storage policy—information isn't retained
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <title>Strict access controls limit data visibility</title>
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Strict access controls limit data visibility
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <title>Only processes the specific emails you select</title>
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Only processes the specific emails you select
              </li>
            </ul>
          </div>
        }
        ctaText=""
        showcaseContent={<Security />}
        position="left"
      />

      <Spacer className="h-20 md:h-24" />

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-bold font-sans text-4xl text-foreground tracking-tight sm:text-5xl">
            Get Started in <span className="text-primary">3 Simple Steps</span>
          </h2>
          <div className="text-muted-foreground">
            <p>
              Starting with Galleo is quick and easy. Our streamlined onboarding
              process gets you up and running in minutes.
            </p>
          </div>
        </div>
        <Spacer className="h-8 md:h-10" />
        <IntegrationSteps />
      </Section>

      <Spacer className="h-20 md:h-24" />

      <Cta />

      <Spacer className="h-20 md:h-24" />
    </div>
  );
}
