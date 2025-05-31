"use client";
import { buttonVariants } from "@galleo/ui/components/ui/button";
import { cn } from "@galleo/ui/utils/cn";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function ReLitiPage() {
  const ease = [0.16, 1, 0.3, 1];
  return (
    <div className="flex flex-col bg-primary-bg text-foreground">
      <style jsx>{`
        .text-primary {
          color: #0C8EF8 !important;
        }
        .bg-primary {
          background-color: #0C8EF8 !important;
        }
        .border-primary {
          border-color: #0C8EF8 !important;
        }
      `}</style>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-30" />
          <div className="-left-20 absolute top-20 h-64 w-64 rounded-full bg-primary opacity-20 blur-3xl" />
          <div className="absolute top-40 right-20 h-72 w-72 rounded-full bg-primary opacity-10 blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              className="font-bold font-sans text-5xl text-foreground tracking-tight sm:text-6xl md:text-7xl"
              initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease,
                staggerChildren: 0.2,
              }}
            >
              {" "}
              <motion.div
                className="block text-balance leading-[1.15] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0,
                  ease,
                }}
              >
                Click <span className="font-bold text-primary">Once</span>.
              </motion.div>
              <motion.div
                className="mt-2 block text-balance leading-[1.15] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  ease,
                }}
              >
                <span className="font-bold text-primary">ReLiti</span> Does The
                Rest.
              </motion.div>
            </motion.h1>
            <motion.p
              className="mt-8 text-muted-foreground text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.6,
                duration: 0.3,
                ease,
              }}
            >
              ReLiti automates E-Litigation downloads with one click so you
              never waste time on mindless clicking again.
            </motion.p>
            <motion.div
              className="mt-10 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.6,
                duration: 0.3,
                ease,
              }}
            >
              <Link
                href="https://chromewebstore.google.com/detail/reliti-by-galleo/mligahkbimlnfogfnkchedcppejpmfkb?authuser=0&hl=en"
                target="_blank"
                className={cn(
                  buttonVariants(),
                  "bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900"
                )}
              >
                Get the ReLiti Chrome Extension Today
                <svg
                  className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>Arrow Right</title>
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Spacer below hero */}
      <div className="h-20 md:h-24" />

      {/* Problem Section (now new text) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-bold font-sans text-4xl text-foreground tracking-tight sm:text-5xl">
              Turn <span className="text-primary">130+ Clicks</span> Into Just{" "}
              <span className="text-primary">One</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Your billable hours are too valuable for repetitive downloads.
              ReLiti automates court searches so you can focus on high-value
              legal work instead of mindless clicking. Used by legal
              professionals to save 40+mins per search and eliminate human
              error.
            </p>
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison Section (updated text and icons) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Without ReLiti */}
              <div className="overflow-hidden rounded-2xl border border-muted bg-white p-8 transition-all duration-300 hover:shadow-lg dark:bg-[#0A2A40]">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Question Mark</title>
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      fill="#fee2e2"
                    />
                    <text
                      x="16"
                      y="21"
                      textAnchor="middle"
                      fontSize="18"
                      fill="#ef4444"
                      fontWeight="bold"
                    >
                      ?
                    </text>
                  </svg>
                </div>
                <h3 className="mb-3 font-bold text-2xl text-foreground">
                  Without ReLiti
                </h3>
                <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src="/reliti/without-reliti.gif"
                    alt="Manual clicking process without ReLiti"
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <p className="text-muted-foreground">
                  Repetitive clicking and frustration as you manually download
                  each file one by one. Hours lost in tedious work while
                  critical case analysis waits.
                </p>
              </div>
              {/* With ReLiti */}
              <div className="overflow-hidden rounded-2xl border border-sky-300 bg-white p-8 transition-all duration-300 hover:shadow-primary/15 dark:bg-[#0A2A40]">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Check Mark</title>
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="#38b6ff"
                      strokeWidth="2.5"
                      fill="#e0f2fe"
                    />
                    <path
                      d="M12.5 16.5L15.5 19.5L20 14"
                      stroke="#38b6ff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 font-bold text-2xl text-foreground">
                  With ReLiti
                </h3>
                <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src="/reliti/with-reliti.gif"
                    alt="Automated downloading with ReLiti"
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <p className="text-muted-foreground">
                  One click and ReLiti automatically handles all downloads for
                  you. Spend your time on more valuable legal work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stop Clicking. Start Billing. Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 font-bold font-sans text-4xl text-foreground tracking-tight sm:text-5xl">
              Stop <span className="text-primary">Clicking</span>. Start{" "}
              <span className="text-primary">Billing.</span>
            </h2>
            <div className="mx-auto max-w-xl rounded-2xl border border-sky-300 bg-white p-8 text-left shadow-xl dark:bg-[#153048]">
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-6 w-6 text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <title>Download</title>
                      <circle
                        cx="12"
                        cy="12"
                        r="11"
                        stroke="#38b6ff"
                        strokeWidth="2"
                        fill="#e0f2fe"
                      />
                      <path
                        d="M7 13l3 3 7-7"
                        stroke="#38b6ff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Download all 130+ documents with a single click
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-6 w-6 text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <title>
                        Complete court searches in minutes, not hours
                      </title>
                      <circle
                        cx="12"
                        cy="12"
                        r="11"
                        stroke="#38b6ff"
                        strokeWidth="2"
                        fill="#e0f2fe"
                      />
                      <path
                        d="M7 13l3 3 7-7"
                        stroke="#38b6ff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Zero risk of missing critical documents
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-6 w-6 text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <title>
                        Complete court searches in minutes, not hours
                      </title>
                      <circle
                        cx="12"
                        cy="12"
                        r="11"
                        stroke="#38b6ff"
                        strokeWidth="2"
                        fill="#e0f2fe"
                      />
                      <path
                        d="M7 13l3 3 7-7"
                        stroke="#38b6ff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Complete court searches in minutes, not hours
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">
                    <svg
                      className="h-6 w-6 text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <title>
                        Seamless integration with your existing E-Litigation
                        workflow
                      </title>
                      <circle
                        cx="12"
                        cy="12"
                        r="11"
                        stroke="#38b6ff"
                        strokeWidth="2"
                        fill="#e0f2fe"
                      />
                      <path
                        d="M7 13l3 3 7-7"
                        stroke="#38b6ff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Seamless integration with your existing E-Litigation workflow
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing and How to Use Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-bold font-sans text-4xl text-foreground tracking-tight sm:text-5xl">
              <span className="text-primary">Free</span> Access,{" "}
              <span className="text-primary">Easy</span> Setup
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Getting started with ReLiti is quick and straightforward. Follow
              these steps to automate your downloads.
            </p>

            <div className="mt-14 flex flex-col justify-center gap-10 md:flex-row">
              <div className="group relative max-w-sm overflow-hidden rounded-2xl border border-border bg-card-custom p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/15">
                <div className="-right-4 -top-4 absolute h-24 w-24 rounded-full bg-primary opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" />
                <div className="relative z-10">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <div className="relative">
                      <svg
                        className="h-10 w-10 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Search as Usual</title>
                        <path
                          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 15V3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="-top-1 -left-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-button text-xs">
                        1
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-3 font-bold text-foreground text-xl">
                    Search as Usual
                  </h3>
                  <p className="text-muted-foreground">
                    Start by conducting your cause book search in eLitigation as
                    you normally would. Enter your search criteria and generate
                    the results.
                  </p>
                </div>
              </div>
              <div className="group relative max-w-sm overflow-hidden rounded-2xl border border-border bg-card-custom p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/15">
                <div className="-right-4 -top-4 absolute h-24 w-24 rounded-full bg-primary opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" />
                <div className="relative z-10">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <div className="relative">
                      <svg
                        className="h-10 w-10 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Navigate to Cause Book Search</title>
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 5L19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="-top-1 -left-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-button text-xs">
                        2
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-3 font-bold text-foreground text-xl">
                    Navigate to Cause Book Search
                  </h3>
                  <p className="text-muted-foreground">
                    Once your search results appear, locate the "Cause Book
                    Search" tab in the left navigation panel.
                  </p>
                </div>
              </div>
              <div className="group relative max-w-sm overflow-hidden rounded-2xl border border-border bg-card-custom p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/15">
                <div className="-right-4 -top-4 absolute h-24 w-24 rounded-full bg-primary opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" />
                <div className="relative z-10">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <div className="relative">
                      <svg
                        className="h-10 w-10 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Select Your Transaction</title>
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 5L19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="-top-1 -left-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-button text-xs">
                        3
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-3 font-bold text-foreground text-xl">
                    Select Your Transaction
                  </h3>
                  <p className="text-muted-foreground">
                    From the search results table, click on the specific
                    transaction reference number that you want to download
                    information for.
                  </p>
                </div>
              </div>
              <div className="group relative max-w-sm overflow-hidden rounded-2xl border border-border bg-card-custom p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/15">
                <div className="-right-4 -top-4 absolute h-24 w-24 rounded-full bg-primary opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" />
                <div className="relative z-10">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <div className="relative">
                      <svg
                        className="h-10 w-10 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Use ReLiti to Download</title>
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 5L19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="-top-1 -left-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-button text-xs">
                        4
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-3 font-bold text-foreground text-xl">
                    Use ReLiti to Download
                  </h3>
                  <p className="text-muted-foreground">
                    Click the ReLiti icon in your Chrome browser extension bar,
                    then press the "Download" button.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-primary-bg p-12 text-center">
            <h2 className="font-bold font-sans text-4xl text-foreground tracking-tight sm:text-5xl">
              Ready for the <span className="text-primary">One Click</span> that{" "}
              <span className="font-bold text-primary">Downloads</span> it All?
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed">
              Join the many legal professionals who've modernized their court
              search workflow with ReLiti.
            </p>
            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:justify-center">
              <Link
                href="https://chromewebstore.google.com/detail/reliti-by-galleo/mligahkbimlnfogfnkchedcppejpmfkb?authuser=0&hl=en"
                target="_blank"
                className={cn(
                  buttonVariants(),
                  "bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900"
                )}
              >
                Get ReLiti Now
                <svg
                  className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <title>Arrow Right</title>
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
