import { buttonVariants } from "@galleo/ui/components/ui/button";
import { Spacer } from "@galleo/ui/components/ui/spacer";
import { cn } from "@galleo/ui/utils/cn";
import type React from "react";
import { Section } from "../_components/section";

const CAL_URL =
  "https://cal.com/galleo/15min?utm_source=top&utm_medium=website&utm_campaign=final&utm_content=website";

export default function OfferPage() {
  return (
    <div className="relative">
      {/* Subtle premium background */}
      <div className="-z-10 pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(250,204,21,0.08),transparent_60%)]" />

      <Spacer className="h-32 md:h-40" />

      {/* SECTION 1: HERO */}
      <Section className="text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-extrabold font-sans text-4xl tracking-tight sm:text-5xl md:text-6xl">
            We'll Be Your Trademark Associate For a Month.{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
              Completely Free.
            </span>
          </h1>
          <div className="mx-auto mt-6 max-w-2xl space-y-3 text-muted-foreground">
            <p className="font-semibold text-lg">
              Zero cost. Zero catch. One full month.
            </p>
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
        </div>
      </Section>

      <Spacer className="h-40 md:h-48" />

      {/* SECTION 2: WHAT WE WILL DO */}
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-bold font-sans text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Email Like You Would Any Associate.{" "}
            <span className="text-primary">That's It.</span>
          </h2>
        </div>

        {/* Two Column Layout: Email Animation + What You Get */}
        <div className="mx-auto mt-8 grid max-w-6xl items-start gap-1 lg:grid-cols-2">
          {/* Left Column: Email Animation */}
          <div className="mx-auto max-w-md">
            <div className="relative mx-auto">
              <style
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{
                  __html: `
                @keyframes emailFlow {
                  0%, 25% { opacity: 1; }
                  30%, 100% { opacity: 0; }
                }
                
                @keyframes waitingFlow {
                  0%, 25% { opacity: 0; }
                  30%, 35% { opacity: 1; }
                  40%, 100% { opacity: 0; }
                }
                
                @keyframes inboxFlow {
                  0%, 35% { opacity: 0; }
                  40%, 60% { opacity: 1; }
                  65%, 100% { opacity: 0; }
                }
                
                @keyframes responseFlow {
                  0%, 60% { opacity: 0; }
                  65%, 95% { opacity: 1; }
                  100% { opacity: 0; }
                }
                
                @keyframes mouseClickSend {
                  0%, 18% { transform: translate(50px, 5px); opacity: 0; }
                  20% { opacity: 1; }
                  22%, 24% { transform: translate(50px, 7px); }
                  26%, 30% { transform: translate(50px, 5px); opacity: 1; }
                  32%, 100% { opacity: 0; }
                }
                
                @keyframes mouseClickEmail {
                  0%, 35% { transform: translate(120px, 10px); opacity: 0; }
                  40% { opacity: 1; }
                  45%, 55% { transform: translate(120px, 10px); }
                  57%, 59% { transform: translate(120px, 12px); }
                  61%, 65% { transform: translate(120px, 10px); opacity: 1; }
                  67%, 100% { opacity: 0; }
                }
                
                @keyframes progressTab1 {
                  0%, 25% { 
                    background-color: rgba(251, 191, 36, 0.1); 
                    border: 1px solid #f59e0b; 
                    color: #f59e0b; 
                  }
                  26%, 100% { 
                    background-color: transparent; 
                    border: 1px solid transparent; 
                    color: #9ca3af; 
                  }
                }
                
                @keyframes progressTab2 {
                  0%, 29% { 
                    background-color: transparent; 
                    border: 1px solid transparent; 
                    color: #9ca3af; 
                  }
                  30%, 35% { 
                    background-color: rgba(251, 191, 36, 0.1); 
                    border: 1px solid #f59e0b; 
                    color: #f59e0b; 
                  }
                  36%, 100% { 
                    background-color: transparent; 
                    border: 1px solid transparent; 
                    color: #9ca3af; 
                  }
                }
                
                @keyframes progressTab3 {
                  0%, 39% { 
                    background-color: transparent; 
                    border: 1px solid transparent; 
                    color: #9ca3af; 
                  }
                  40%, 60% { 
                    background-color: rgba(251, 191, 36, 0.1); 
                    border: 1px solid #f59e0b; 
                    color: #f59e0b; 
                  }
                  61%, 100% { 
                    background-color: transparent; 
                    border: 1px solid transparent; 
                    color: #9ca3af; 
                  }
                }
                
                @keyframes progressTab4 {
                  0%, 64% { 
                    background-color: transparent; 
                    border: 1px solid transparent; 
                    color: #9ca3af; 
                  }
                  65%, 95% { 
                    background-color: rgba(251, 191, 36, 0.1); 
                    border: 1px solid #f59e0b; 
                    color: #f59e0b; 
                  }
                  96%, 100% { 
                    background-color: transparent; 
                    border: 1px solid transparent; 
                    color: #9ca3af; 
                  }
                }
                
                @keyframes buttonPress {
                  0%, 20% { transform: scale(1); }
                  22%, 26% { transform: scale(0.95); }
                  28%, 100% { transform: scale(1); }
                }
                
                @keyframes newEmailBadge {
                  0%, 35% { transform: scale(0); opacity: 0; }
                  40% { transform: scale(1.2); opacity: 1; }
                  45%, 60% { transform: scale(1); opacity: 1; }
                  65%, 100% { transform: scale(0); opacity: 0; }
                }
                
                .email-step {
                  animation-duration: 15s;
                  animation-iteration-count: infinite;
                  animation-timing-function: ease-in-out;
                }
                
                .email-compose { animation-name: emailFlow; }
                .email-waiting { animation-name: waitingFlow; }
                .email-inbox { animation-name: inboxFlow; }
                .email-response { animation-name: responseFlow; }
                .mouse-send { animation: mouseClickSend 15s infinite ease-in-out; }
                .mouse-email { animation: mouseClickEmail 15s infinite ease-in-out; }
                .animated-button { animation: buttonPress 15s infinite ease-in-out; }
                .new-email-badge { animation: newEmailBadge 15s infinite ease-in-out; }
                .progress-tab-1 { animation: progressTab1 15s infinite ease-in-out; }
                .progress-tab-2 { animation: progressTab2 15s infinite ease-in-out; }
                .progress-tab-3 { animation: progressTab3 15s infinite ease-in-out; }
                .progress-tab-4 { animation: progressTab4 15s infinite ease-in-out; }
              `,
                }}
              />

              {/* Container without outline */}
              <div className="relative">
                {/* Step 1: Compose Email */}
                <div className="email-step email-compose absolute inset-0">
                  <div className="overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    <div className="flex items-center gap-2 border-border/50 border-b bg-muted px-3 py-2">
                      <span className="size-2 rounded-full bg-red-400" />
                      <span className="size-2 rounded-full bg-yellow-400" />
                      <span className="size-2 rounded-full bg-green-400" />
                      <div className="ml-2 text-muted-foreground text-xs">
                        New Email
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          To:
                        </span>
                        <span className="font-medium text-primary text-sm">
                          pam@galleo.ai
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          Subject:
                        </span>
                        <span className="text-foreground text-xs">
                          Urgent TM Analysis - Client Meeting Tomorrow
                        </span>
                      </div>
                      <div className="h-20 overflow-hidden rounded border border-border bg-muted/30 p-3">
                        <div className="break-words text-muted-foreground text-xs leading-relaxed">
                          Hi Pam,
                          <br />
                          <br />
                          Need help with "BRIGHTTECH SOLUTIONS" TM filing.
                          <br />
                          Classes 9, 35, 42. Any prior art concerns?
                          <br />
                          Client meeting tomorrow 2pm.
                          <br />
                          <br />
                          Thanks, Sarah
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          className="animated-button w-full rounded bg-primary px-3 py-1.5 font-medium text-primary-foreground text-xs"
                        >
                          Send
                        </button>
                        {/* Animated Mouse Cursor for Send Button */}
                        <div className="mouse-send -right-12 -top-1 pointer-events-none absolute">
                          <svg
                            className="size-4 text-foreground"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <title>Send button mouse cursor</title>
                            <path d="M13.64 21.97c-.95-.02-1.84-.42-2.51-1.13L3.52 13.22c-.68-.71-1.05-1.66-1.02-2.64.02-.98.44-1.9 1.18-2.58a3.59 3.59 0 0 1 2.57-1.06c.96 0 1.87.36 2.57 1.01l2.8 2.81V5.88c0-1.98 1.61-3.59 3.59-3.59s3.59 1.61 3.59 3.59v8.1l1.06-.55c.15-.08.31-.12.48-.12.17 0 .33.04.48.12.3.15.48.46.48.8 0 .33-.18.65-.48.8l-4.25 2.19c-.3.15-.65.15-.95 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Brief Processing State */}
                <div className="email-step email-waiting absolute inset-0">
                  <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                    <div className="mb-3 flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-4 py-3">
                      <svg
                        className="size-5 animate-spin text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <title>Processing...</title>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      <span className="font-medium text-primary text-sm">
                        Processing...
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      &lt; 3 hours
                    </p>
                  </div>
                </div>

                {/* Step 3: Inbox with New Email */}
                <div className="email-step email-inbox absolute inset-0">
                  <div className="overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    <div className="flex items-center gap-2 border-border/50 border-b bg-muted px-3 py-2">
                      <span className="size-2 rounded-full bg-red-400" />
                      <span className="size-2 rounded-full bg-yellow-400" />
                      <span className="size-2 rounded-full bg-green-400" />
                      <div className="ml-2 text-muted-foreground text-xs">
                        Inbox
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {/* New Email with Badge */}
                        <div className="relative cursor-pointer rounded border border-primary/30 bg-primary/5 p-3 transition-colors hover:bg-primary/10">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-primary text-xs">
                                  pam@galleo.ai
                                </span>
                                <span className="new-email-badge rounded-full bg-primary px-2 py-0.5 font-medium text-[10px] text-primary-foreground">
                                  NEW
                                </span>
                              </div>
                              <div className="mt-1 overflow-hidden truncate font-medium text-foreground text-xs">
                                Re: Urgent TM Analysis
                              </div>
                              <div className="mt-1 overflow-hidden truncate text-muted-foreground text-xs">
                                Complete analysis attached...
                              </div>
                            </div>
                            <div className="ml-2 text-[10px] text-muted-foreground">
                              2h ago
                            </div>
                          </div>
                          {/* Animated Mouse for clicking email */}
                          <div className="mouse-email pointer-events-none absolute top-2 right-2">
                            <svg
                              className="size-4 text-foreground"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <title>Email mouse cursor</title>
                              <path d="M13.64 21.97c-.95-.02-1.84-.42-2.51-1.13L3.52 13.22c-.68-.71-1.05-1.66-1.02-2.64.02-.98.44-1.9 1.18-2.58a3.59 3.59 0 0 1 2.57-1.06c.96 0 1.87.36 2.57 1.01l2.8 2.81V5.88c0-1.98 1.61-3.59 3.59-3.59s3.59 1.61 3.59 3.59v8.1l1.06-.55c.15-.08.31-.12.48-.12.17 0 .33.04.48.12.3.15.48.46.48.8 0 .33-.18.65-.48.8l-4.25 2.19c-.3.15-.65.15-.95 0z" />
                            </svg>
                          </div>
                        </div>
                        {/* Other emails */}
                        <div className="rounded border border-border bg-muted/30 p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-muted-foreground text-xs">
                                client@techcorp.com
                              </div>
                              <div className="mt-1 text-muted-foreground text-xs">
                                Contract Review Request
                              </div>
                              <div className="mt-1 truncate text-muted-foreground text-xs">
                                Please review the attached licensing
                                agreement...
                              </div>
                            </div>
                            <div className="ml-2 text-[10px] text-muted-foreground">
                              1d ago
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Perfect Response */}
                <div className="email-step email-response absolute inset-0">
                  <div className="overflow-hidden rounded-lg border border-primary/30 bg-card shadow-lg">
                    <div className="flex items-center gap-2 border-primary/20 border-b bg-primary/5 px-3 py-2">
                      <span className="size-2 rounded-full bg-red-400" />
                      <span className="size-2 rounded-full bg-yellow-400" />
                      <span className="size-2 rounded-full bg-green-400" />
                      <div className="ml-2 font-medium text-primary text-xs">
                        Perfect Response ✓
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          From:
                        </span>
                        <span className="font-medium text-primary text-sm">
                          pam@galleo.ai
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          Subject:
                        </span>
                        <span className="text-foreground text-xs">
                          Re: Urgent TM Analysis - Client Meeting Tomorrow
                        </span>
                      </div>
                      <div className="h-20 overflow-hidden rounded border border-primary/20 bg-primary/5 p-3">
                        <div className="break-words text-foreground text-xs leading-relaxed">
                          Hi Sarah,
                          <br />
                          <br />✓{" "}
                          <strong>BRIGHTTECH SOLUTIONS clear to file</strong>
                          <br />✓ No prior art conflicts found
                          <br />✓ Madrid Protocol recommended
                          <br />
                          <br />
                          Analysis + client deck attached.
                          <br />
                          Ready for 2pm meeting!
                          <br />
                          <br />
                          Pam
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-primary text-xs">
                          <svg
                            className="size-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <title>Ready to forward</title>
                            <path d="M9 12l2 2 4-4" />
                          </svg>
                          <span>Ready to forward</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Delivered in 3m
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Static spacer to maintain layout */}
                <div className="pointer-events-none h-80 opacity-0">
                  <div className="h-full overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    <div className="flex items-center gap-2 border-border/50 border-b bg-muted px-3 py-2">
                      <span className="size-2 rounded-full bg-red-400" />
                      <span className="size-2 rounded-full bg-yellow-400" />
                      <span className="size-2 rounded-full bg-green-400" />
                      <div className="ml-2 text-muted-foreground text-xs">
                        Email
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          To:
                        </span>
                        <span className="font-medium text-primary text-sm">
                          pam@galleo.ai
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          Subject:
                        </span>
                        <span className="text-foreground text-xs">
                          TM Filing Question
                        </span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 p-2">
                        <div className="text-muted-foreground text-xs leading-relaxed">
                          Client wants to file trademark for "ACME Corp" in
                          classes 35, 41...
                        </div>
                      </div>
                      <button
                        type="button"
                        className="w-full rounded bg-primary px-3 py-1.5 font-medium text-primary-foreground text-xs"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator - Right below email */}
            <div className="-mt-10 flex justify-center">
              <div className="progress-tab-1 rounded-lg px-3 py-1.5 text-sm transition-all duration-300">
                Compose
              </div>
              <div className="progress-tab-2 rounded-lg px-3 py-1.5 text-sm transition-all duration-300">
                Process
              </div>
              <div className="progress-tab-3 rounded-lg px-3 py-1.5 text-sm transition-all duration-300">
                Inbox
              </div>
              <div className="progress-tab-4 rounded-lg px-3 py-1.5 text-sm transition-all duration-300">
                Response
              </div>
            </div>
          </div>

          {/* Right Column: What You Get */}
          <div className="flex flex-col justify-center lg:border-border lg:border-l-2 lg:pl-8">
            <div className="mb-6 text-center font-bold text-foreground text-lg lg:text-left">
              What You Get:
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>30+ trademark matters handled perfectly</title>
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z" />
                    <path d="M1 12v7c0 .552.448 1 1 1h20c.552 0 1-.448 1-1v-7" />
                  </svg>
                </div>
                <span className="text-foreground">
                  30+ trademark matters handled perfectly
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>3-hour turnaround on every response</title>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                </div>
                <span className="text-foreground">
                  3-hour turnaround on every response
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>Responses written in your exact style</title>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                </div>
                <span className="text-foreground">
                  Responses written in your exact style
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>Complete confidentiality and professionalism</title>
                    <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
                  </svg>
                </div>
                <span className="text-foreground">
                  Complete confidentiality and professionalism
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>Work directly from your existing Outlook</title>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="text-foreground">
                  Work directly from your existing Outlook
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-4xl text-center">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="mb-3 font-bold text-foreground text-xl">
              Our Guarantee
            </h3>
            <p className="text-foreground text-lg leading-relaxed">
              Don't feel you have more control over your firm by month's end?
              We'll work another month free. Don't like our work? Fire us
              instantly - all your data gets deleted within 24 hours.
            </p>
          </div>
        </div>
      </Section>

      <Spacer className="h-32 md:h-40" />

      {/* SECTION 3: SECURITY & CONTROL */}
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-bold font-sans text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Your Security Protocols. Our Compliance.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We understand law firm security concerns and will sign whatever
            agreements necessary to give you complete control over your data and
            processes.
          </p>
        </div>

        {/* Two Column Layout: Secure Computer + What You Control */}
        <div className="mx-auto mt-8 grid max-w-6xl items-start gap-1 lg:grid-cols-2">
          {/* Left Column: Secure Computer Graphic */}
          <div className="mx-auto max-w-md">
            <div className="relative mx-auto">
              {/* Monitor Only */}
              <div className="relative mx-auto h-64 w-96">
                {/* Monitor Frame - Larger */}
                <div className="absolute top-0 h-56 w-full overflow-hidden rounded-xl border-8 border-slate-800 bg-gradient-to-br from-slate-900 to-black shadow-2xl">
                  {/* Blue Desktop Background */}
                  <div className="absolute inset-2 overflow-hidden rounded-lg bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900">
                    {/* Document Window - Full Size */}
                    <div className="absolute top-4 right-4 bottom-2 left-4">
                      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
                        {/* Title Bar */}
                        <div className="flex items-center gap-2 border-gray-200 border-b bg-gray-100 px-3 py-2">
                          <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />
                          <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-sm" />
                          <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm" />
                          <span className="ml-2 font-medium text-gray-600 text-xs">
                            Confidential_Document.docx
                          </span>
                        </div>

                        {/* Document Content */}
                        <div className="relative flex-1 space-y-2 bg-white p-4">
                          <div className="h-2 w-3/4 rounded bg-gray-800" />
                          <div className="h-2 w-full rounded bg-gray-600" />
                          <div className="h-2 w-5/6 rounded bg-gray-600 blur-sm" />
                          <div className="h-2 w-2/3 rounded bg-gray-400 blur-sm" />
                          <div className="h-2 w-1/2 rounded bg-blue-600 blur-sm" />
                          <div className="h-2 w-4/5 rounded bg-gray-600 blur-sm" />
                          <div className="h-2 w-3/4 rounded bg-gray-400 blur-sm" />
                          <div className="h-2 w-2/3 rounded bg-gray-600 blur-sm" />
                          <div className="h-2 w-full rounded bg-gray-400 blur-sm" />

                          {/* Security Status Badge - Centered in Document */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-50 px-4 py-2 text-green-700 text-sm shadow-lg">
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <title>Document Secured & Verified</title>
                                <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
                              </svg>
                              <span className="font-medium">
                                Document Secured & Verified
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: What You Control */}
          <div className="flex flex-col justify-center lg:border-border lg:border-l-2 lg:pl-8">
            <div className="mb-6 text-center font-bold text-foreground text-lg lg:text-left">
              Secure Control:
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>
                      Enterprise-grade encryption and data protection
                    </title>
                    <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
                  </svg>
                </div>
                <span className="text-foreground">
                  Enterprise-grade encryption and data protection
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>Full NDA signed before we see anything</title>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <span className="text-foreground">
                  Full NDA signed before we see anything
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>Singapore PDPA compliant infrastructure</title>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <circle cx="12" cy="16" r="1" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <span className="text-foreground">
                  Singapore PDPA compliant infrastructure
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="size-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>Instant deletion when you say so</title>
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </div>
                <span className="text-foreground">
                  Instant deletion when you say so
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Spacer className="h-32 md:h-40" />

      {/* SECTION 4: WHAT'S THE CATCH */}
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-bold font-sans text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Why We Are Giving One Month{" "}
            <span className="text-primary">Free</span>
          </h2>

          <div className="mx-auto mt-8 max-w-3xl space-y-2 text-center">
            {/* Consistent narrative flow */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              You want control over your firm's output. We built AI that
              delivers it.
            </p>

            <p className="font-semibold text-lg text-primary leading-relaxed">
              The fastest way to prove it? Show you.
            </p>
          </div>

          {/* Long term partnership goal */}
          <div className="mx-auto mt-16 max-w-6xl">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-10 shadow-xl dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
              {/* Left-Right Column Layout */}
              <div className="grid items-center gap-16 lg:grid-cols-2">
                {/* Left Column - Partnership Goal */}
                <div className="text-center">
                  {/* Icon above title */}
                  <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 p-4">
                      <svg
                        className="size-10 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <title>Long Term Partnership Is Our Goal</title>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="mb-6 font-bold text-2xl text-foreground">
                    Long Term Partnership Is Our Goal
                  </h3>

                  <div className="space-y-4 text-base text-foreground leading-relaxed">
                    <p>
                      After you work with us,{" "}
                      <span className="font-semibold text-primary">
                        we know
                      </span>{" "}
                      you'll get unprecedented control over your own firm.
                    </p>
                    <p>
                      And{" "}
                      <span className="font-semibold text-primary">
                        we know
                      </span>{" "}
                      you'll be wondering how you did without it.
                    </p>
                    <p className="font-semibold text-primary">
                      That's exactly what we're betting you'll experience in
                      your free month.
                    </p>
                  </div>
                </div>

                {/* Right Column - Pricing */}
                <div className="rounded-2xl border-2 border-primary/20 bg-white p-10 shadow-lg dark:border-primary/30 dark:bg-slate-800">
                  <div className="space-y-4 text-center">
                    <p className="font-semibold text-lg text-muted-foreground dark:text-slate-300">
                      And for only
                    </p>

                    {/* Prominent Pricing with Slash */}
                    <div className="flex items-center justify-center gap-2">
                      <div className="font-black text-4xl text-primary tracking-tight">
                        $3,000
                      </div>
                      <div className="font-bold text-3xl text-muted-foreground dark:text-slate-400">
                        /
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="font-bold text-2xl text-muted-foreground line-through dark:text-slate-400">
                          $8,000
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs dark:text-slate-400">
                          (typical associate cost)
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold text-lg text-muted-foreground dark:text-slate-300">
                      per month after
                    </p>

                    <p className="text-base text-foreground leading-relaxed">
                      Galleo continues being your associate in your inbox and
                      with our support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Spacer className="h-32 md:h-40" />

      {/* SECTION 5: CLAIM YOUR SPOT */}
      <Section className="text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-bold font-sans text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Gold Has Never Been Served{" "}
            <span className="text-primary">Cheaper, Or Easier</span>
          </h2>

          {/* 3-Step Visual Process */}
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="grid items-center gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
                <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-full border-2 border-primary/30 bg-gradient-to-r from-primary/20 to-primary/10">
                  {/* Phone icon */}
                  <svg
                    className="size-8 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>15-Minute Call</title>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {/* Number badge */}
                  <div className="-top-2 -right-2 absolute flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground">
                    <span className="font-bold text-sm">1</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 text-center">
                  <h3 className="font-bold text-foreground text-xl">
                    15-Minute Call
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-primary">
                      No obligations
                    </span>{" "}
                    - We'll be happy to chat if you're just curious! Ask any
                    questions you have.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
                <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-full border-2 border-primary/30 bg-gradient-to-r from-primary/20 to-primary/10">
                  {/* Document/Shield icon for NDA */}
                  <svg
                    className="size-8 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>Sign NDA & Prep</title>
                    <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  {/* Number badge */}
                  <div className="-top-2 -right-2 absolute flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground">
                    <span className="font-bold text-sm">2</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 text-center">
                  <h3 className="font-bold text-foreground text-xl">
                    Sign NDA & Prep
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We'll sign your NDA and prepare any other documents
                    required.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
                <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-full border-2 border-primary/30 bg-gradient-to-r from-primary/20 to-primary/10">
                  {/* Send/Forward icon */}
                  <svg
                    className="size-8 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>Start Forwarding!</title>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                    <path d="M12 13l8-7" />
                  </svg>
                  {/* Number badge */}
                  <div className="-top-2 -right-2 absolute flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground">
                    <span className="font-bold text-sm">3</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 text-center">
                  <h3 className="font-bold text-foreground text-xl">
                    Start Forwarding!
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We're your free associate for a month just like that.
                  </p>
                </div>
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
            5 spots left. Don't be the partner who missed the easiest win of the
            year.
          </p>
        </div>
      </Section>

      <Spacer className="h-32 md:h-40" />
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
