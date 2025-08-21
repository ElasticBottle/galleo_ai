import { buttonVariants } from "@galleo/ui/components/ui/button";
import { Spacer } from "@galleo/ui/components/ui/spacer";
import { cn } from "@galleo/ui/utils/cn";
import type React from "react";
import { Section } from "../_components/section";

const CAL_URL = "https://cal.com/your-workspace/free-month-intro";

export default function OfferPage() {
  return (
    <div className="relative">
      {/* Subtle premium background */}
      <div className="-z-10 pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(250,204,21,0.08),transparent_60%)]" />

      <Spacer className="h-20 md:h-24" />

      {/* SECTION 1: HERO */}
      <Section className="text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-extrabold font-sans text-4xl tracking-tight sm:text-5xl md:text-6xl">
            We'll Work As Your Trademark Associate For An Entire Month.{" "}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Completely Free.
            </span>
          </h1>
          <div className="mx-auto mt-6 max-w-2xl space-y-3 text-muted-foreground">
            <p>This sounds crazy, but we're dead serious.</p>
            <p>Everything your associate does. Zero cost. Zero catch.</p>
            <p>Yes, it's absurd. Yes, you should take it.</p>
          </div>

          <div className="mt-8">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Claim my free month - opens in a new tab"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-8 py-6 text-base shadow-md",
              )}
            >
              Claim My Free Month
            </a>
            <p className="mt-3 text-muted-foreground text-xs">
              No credit card required. No commitment.
            </p>
          </div>

          {/* Hero Graphic */}
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xl">
              <div className="-left-10 -top-10 pointer-events-none absolute h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="-right-10 -bottom-10 pointer-events-none absolute h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
              <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                <div className="rounded-full border border-border bg-muted px-4 py-2 text-primary text-xs uppercase tracking-widest">
                  Bold Offer
                </div>
                <div className="mt-5 rounded-xl border border-border p-[2px] shadow-lg">
                  <div className="rounded-xl bg-card px-6 py-8">
                    <div className="font-black text-2xl text-primary tracking-wide">
                      FREE MONTH OF TRADEMARK WORK
                    </div>
                    <div className="mt-2 text-muted-foreground text-sm">
                      We know. It sounds too good to be true.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Spacer className="h-20 md:h-24" />

      {/* SECTION 2: WHAT WE WILL DO */}
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-bold font-sans text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Forward Email.{" "}
            <span className="text-primary">Get Perfect Response.</span> That's
            It.
          </h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <ul className="space-y-3 text-muted-foreground">
              <CheckItem>
                Forward trademark enquiry to your dedicated email
              </CheckItem>
              <CheckItem>Receive perfect response in 3 hours</CheckItem>
              <CheckItem>Send to client and bill as usual</CheckItem>
              <CheckItem>
                Repeat until you have complete control over your trademark
                workflow
              </CheckItem>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <div className="font-semibold text-foreground">What You Get:</div>
            <ul className="mt-3 space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check /> 30+ trademark matters handled perfectly
              </li>
              <li className="flex items-start gap-2">
                <Check /> 3-hour turnaround on every response
              </li>
              <li className="flex items-start gap-2">
                <Check /> Responses written in your exact style
              </li>
              <li className="flex items-start gap-2">
                <Check /> Complete confidentiality and professionalism
              </li>
              <li className="flex items-start gap-2">
                <Check /> Work directly from your existing Outlook
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-4xl text-center text-muted-foreground text-sm">
          <span className="font-semibold text-foreground">Our Guarantee:</span>{" "}
          Don't feel you have more control over your firm by month's end? We'll
          work another month free. Don't like our work? Fire us instantly - all
          your data gets deleted within 24 hours.
        </div>

        {/* Workflow Graphic */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <WorkflowCard title="Forward Email" subtitle="Your enquiry" />
            <div className="flex items-center justify-center text-muted-foreground text-sm">
              <span className="rounded-full border border-border bg-muted px-3 py-1 text-muted-foreground text-xs uppercase tracking-wide">
                3 hours later
              </span>
            </div>
            <WorkflowCard
              title="Perfect Response"
              subtitle="Your style • Your clients • Your control"
              highlight
            />
          </div>
        </div>
      </Section>

      <Spacer className="h-20 md:h-24" />

      {/* SECTION 3: CONCERNS ALLEVIATED */}
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-bold font-sans text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Done Securely, On Your Terms
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We know what matters to law firms because we work with them every
            day.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <div className="font-semibold">Your Data Protection</div>
            <ul className="mt-3 space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check /> AES-256 encryption - same as your bank
              </li>
              <li className="flex items-start gap-2">
                <Check /> Full NDA signed before we see anything
              </li>
              <li className="flex items-start gap-2">
                <Check /> Singapore PDPA compliant
              </li>
              <li className="flex items-start gap-2">
                <Check /> Instant deletion when you say so
              </li>
              <li className="flex items-start gap-2">
                <Check /> Zero training usage - your matters stay private
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-md">
            <div className="space-y-4 text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Zero Disruption:
                </span>{" "}
                Works from your existing Outlook. No new software, logins, or
                training. Your clients never know we exist.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Complete Control:
                </span>{" "}
                You review everything before it goes to clients. Fire us
                anytime, keep all the work.
              </p>
            </div>
          </div>
        </div>

        {/* Security Graphic */}
        <div className="mx-auto mt-10 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-center gap-2 border-border/50 border-b bg-muted px-4 py-2">
              <span className="size-2 rounded-full bg-red-400" />
              <span className="size-2 rounded-full bg-yellow-400" />
              <span className="size-2 rounded-full bg-green-400" />
              <div className="ml-auto flex items-center gap-2 text-primary text-xs">
                <Shield /> Your workflow. Our security. Zero compromise.
              </div>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-3">
              <div className="col-span-2 rounded-lg border border-border bg-muted p-4">
                <div className="text-muted-foreground text-sm">Outlook</div>
                <div className="mt-2 rounded-md border border-border bg-card p-3">
                  <div className="grid grid-cols-[140px_1fr] gap-3">
                    <div className="space-y-2">
                      <div className="text-muted-foreground text-xs">Inbox</div>
                      <div className="rounded-md border border-border bg-muted/60 p-2">
                        <div className="font-medium text-foreground text-xs">
                          Client - TM enquiry
                        </div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          Please advise on filing classes...
                        </div>
                      </div>
                      <div className="rounded-md border border-border bg-muted/40 p-2">
                        <div className="font-medium text-foreground text-xs">
                          IPOS - Office Action
                        </div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          Response due in 14 days...
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-foreground text-sm">
                          Re: Client - TM enquiry
                        </div>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                          Draft
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Good morning - attached is the draft response for
                        Classes 35 and 41. Let me know if you want adjustments
                        to tone or coverage.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-muted-foreground text-sm">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Shield /> Security
                </div>
                <ul className="space-y-2">
                  <li>Encryption: AES-256</li>
                  <li>NDA: Signed</li>
                  <li>Compliance: PDPA</li>
                  <li>Deletion: Instant</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Spacer className="h-20 md:h-24" />

      {/* SECTION 4: WHAT'S THE CATCH */}
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-bold font-sans text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Here's Why We're Doing This For Free
          </h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-muted-foreground">
            <p>
              Partners need control over firm output without management
              headaches. We've built AI technology that solves this. The fastest
              way to prove it? Let you experience it.
            </p>
            <p className="font-medium text-foreground">The Real Story:</p>
            <p>
              This is the most frictionless way your firm could adopt AI. No
              handholding, no training, no risk - just results. We do the work,
              you get the benefits.
            </p>
            <p className="font-medium text-foreground">What Happens Next:</p>
            <p>
              After your free month, you'll understand exactly what AI can do
              for trademark work. If you want to continue, it's{" "}
              <span className="font-semibold text-primary">$3,000/month</span>{" "}
              (versus <span className="line-through opacity-70">$8,000+</span>{" "}
              for an associate). If not, walk away with a month of free work.
            </p>
            <p className="text-foreground">
              Our Bet: Once you experience having this level of control -
              perfect work, instant turnaround, zero management - you'll wonder
              how you ever managed without it.
            </p>
          </div>
        </div>

        {/* Two-stage Illustration */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
            <StageCard title="Free Month" subtitle="We prove our value" />
            <div className="flex items-center justify-center">
              <Arrow />
            </div>
            <StageCard
              title="Partnership"
              subtitle="You get permanent control"
              highlight
            />
          </div>
          <p className="mt-4 text-center text-muted-foreground text-sm">
            Win-win, starting with all win for you
          </p>
        </div>
      </Section>

      <Spacer className="h-20 md:h-24" />

      {/* SECTION 5: CLAIM YOUR SPOT */}
      <Section className="text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-bold font-sans text-3xl tracking-tight sm:text-4xl md:text-5xl">
            We're Literally Giving You Gold On A Silver Platter
          </h2>
          <div className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            <p>Here's what happens:</p>
            <ul className="mt-3 space-y-2">
              <CheckItem>
                15-minute call - see exactly how forwarding works
              </CheckItem>
              <CheckItem>
                Sign NDA - data protection starts immediately
              </CheckItem>
              <CheckItem>Start tomorrow - begin within 24 hours</CheckItem>
            </ul>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-md">
              <div className="text-muted-foreground text-sm">
                Spots Remaining
              </div>
              <div className="mt-2 font-black text-3xl text-primary tracking-wide">
                3
              </div>
              <div className="mt-1 text-muted-foreground text-xs">
                This month only
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-md">
              <div className="text-muted-foreground text-sm">Schedule</div>
              <div className="mt-2 font-black text-3xl text-foreground tracking-wide">
                15 min
              </div>
              <div className="mt-1 text-muted-foreground text-xs">
                Call today → Start tomorrow
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-md">
              <div className="text-muted-foreground text-sm">Decision</div>
              <div className="mt-2 font-black text-3xl text-foreground tracking-wide">
                Easiest
              </div>
              <div className="mt-1 text-muted-foreground text-xs">
                Guaranteed, zero downside
              </div>
            </div>
          </div>

          <div className="mt-10">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book my 15-minute call now - opens in a new tab"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-10 py-7 text-base shadow-lg",
              )}
            >
              Book My 15-Minute Call Now
            </a>
            <p className="mt-3 text-muted-foreground text-xs">
              Guaranteed free. Instant start within 24 hours.
            </p>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground text-sm">
            3 spots left. Don't be the partner who missed the easiest win of the
            year.
          </p>
        </div>
      </Section>

      <Spacer className="h-24" />
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5">
        <svg
          className="size-4 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}

function Check() {
  return (
    <svg
      className="mt-0.5 size-5 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Shield() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      className="h-6 w-10 text-primary"
      viewBox="0 0 48 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 12h40" />
      <path d="M36 6l6 6-6 6" />
    </svg>
  );
}

function WorkflowCard({
  title,
  subtitle,
  highlight,
}: { title: string; subtitle: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6 shadow-lg",
        highlight ? "border-primary/30 bg-card" : "border-border bg-card",
      )}
    >
      <div className="text-muted-foreground text-sm">{title}</div>
      <div className="mt-2 font-semibold text-foreground text-lg">
        {subtitle}
      </div>
      {highlight && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-muted px-3 py-1 text-primary text-xs">
          <Check /> Your style ✓ Your clients ✓ Your control ✓
        </div>
      )}
    </div>
  );
}

function StageCard({
  title,
  subtitle,
  highlight,
}: { title: string; subtitle: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 shadow-xl",
        highlight ? "border-primary/30 bg-card" : "border-border bg-card",
      )}
    >
      <div className="text-muted-foreground text-sm">Stage</div>
      <div className="mt-2 font-black text-2xl text-foreground tracking-wide">
        {title}
      </div>
      <div className="mt-1 text-muted-foreground text-sm">{subtitle}</div>
    </div>
  );
}
