import { type IconProps, LogoSmall } from "@galleo/ui/components/icon";
import type { ButtonProps } from "@galleo/ui/components/ui/button";
import type { ReactNode } from "react";
import { ROUTE_CONTACT_US, ROUTE_DASHBOARD } from "./routes";

const COMPANY_NAME = "Galleo";
const SUPPORT_EMAIL = "support@galleo.ai";
export const siteConfig: SiteConfig = {
  name: COMPANY_NAME,
  description:
    "Free your team from repetitive TM tasks with AI-powered trademark advice and filing automation tailored for law firms and TM agencies. Built by IP professionals and trained by IP law experts, our solution anticipates unique trademark challenges while delivering faster, more efficient processing and increased accuracy through instant AI analysis.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:6969",
  icon: LogoSmall,
  keywords: ["Trademark", "Branding", "Patent", "IP"],
  links: {
    email: SUPPORT_EMAIL,
    contact: "contact@galleo.ai",
    talkToUs: ROUTE_CONTACT_US,
    twitter: "https://twitter.com/galleo_ai",
  },
  header: [
    {
      variant: "button",
      buttonVariant: "navigation",
      href: "/",
      label: "Home",
    },
    {
      variant: "button",
      buttonVariant: "navigation",
      href: "/insights",
      label: "Insights",
    },
    {
      variant: "button",
      buttonVariant: "navigation",
      href: "/reliti",
      label: "Reliti",
    },
    {
      variant: "button",
      buttonVariant: "default",
      target: "_blank",
      href: ROUTE_DASHBOARD,
      label: "Try Galleo Today",
    },
  ],
  hero: {
    title: ["Draft.", "Send.", "Bill.", "Repeat."],
    description:
      "Galleo instantly generates complete trademark enquiry assessments, precise fee quotes, and accurate NICE classifications—freeing your talent for billable work.",
    cta: {
      href: ROUTE_DASHBOARD,
      label: "Try Galleo Today",
      target: "_blank",
      buttonVariant: "default",
    },
  },
  socialProof: {
    icons: [
      {
        href: "/icons/oxford.png",
        name: "Oxford",
      },
      {
        href: "/icons/drew-and-napier.jpg",
        name: "Drew and Napier",
      },
      {
        href: "https://i0.wp.com/thecustodian.ca/wp-content/uploads/2022/02/waterloo.png?fit=600%2C600&ssl=1",
        name: "Waterloo",
      },
      {
        href: "/icons/baker.jpg",
        name: "Baker",
      },
      {
        href: "/icons/nus.png",
        name: "NUS",
      },
      {
        href: "/icons/pwc.png",
        name: "PWC",
      },
    ],
  },
  cta: {
    subtitle: (
      <>
        Ready to <span className="text-primary">Stop Drafting</span> and{" "}
        <span className="text-primary">Start Billing</span>?
      </>
    ),
    buttonText: "Try Galleo Today",
    href: ROUTE_DASHBOARD,
  },
  footer: {
    items: [],
  },
};

export type HeaderButtonConfig = {
  variant: "button";
  buttonVariant: ButtonProps["variant"] | "navigation";
  target?: "_blank" | "_self" | "_parent" | "_top";
  href: string;
  label: string;
};

export type HeaderDropdownConfig = {
  variant: "dropdown";
  label: string;
  content: {
    main?: {
      icon: React.ReactNode;
      title: string;
      description: string;
      href: string;
    };
    items: {
      href: string;
      title: string;
      description: string;
    }[];
  };
};

export type SiteConfig = {
  name: string;
  description: string;
  icon: (props: IconProps) => React.ReactNode;
  url: string;
  keywords: string[];
  links: {
    email?: string;
    contact?: string;
    talkToUs?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  header: (HeaderButtonConfig | HeaderDropdownConfig)[];
  announcement?: {
    title: string;
    href: string;
  };
  hero: {
    title: string[];
    description: string;
    cta: {
      href: string;
      label: string;
      buttonVariant: ButtonProps["variant"];
      target?: HeaderButtonConfig["target"];
      subtitle?: string;
    };
    showcase?: {
      videoSrc?: string | undefined;
      thumbnailSrc: string;
      thumbnailAlt: string;
    };
  };
  socialProof?: {
    title?: string;
    icons: {
      href: string;
      name: string;
    }[];
  };
  problems?: {
    title?: string;
    subtitle: string;
    description?: string;
    items: {
      title: string;
      description: string;
      icon: (props: IconProps) => React.ReactNode;
    }[];
  };
  benefits?: {
    title?: string;
    subtitle: string;
    description?: string;
    items: {
      title: string;
      description: string;
      wrapperClassName?: string;
      content: React.ReactNode;
    }[];
  };
  solution?: {
    title?: string;
    subtitle: string;
    description?: string;
    items: {
      icon: (props: IconProps) => React.ReactNode;
      title: string;
      description: string;
      className?: string;
      cta?: {
        href: string;
        label: string;
      };
      background?: React.ReactNode;
    }[];
  };
  howItWorks?: {
    title?: string;
    subtitle: string;
    description?: string;
    items: {
      title: string;
      description: string;
      icon?: React.ReactNode;
      image?: string;
      video?: string;
      content?: React.ReactNode;
    }[];
  };
  testimonials?: {
    title?: string;
    subtitle: string;
    description?: string;
    items: {
      name: string;
      role: string;
      quote: string;
      company: string;
    }[];
  };
  pricing?: {
    title?: string;
    subtitle: string;
    description?: string;
  } & (
    | {
        variant: "subscription";
        items: {
          name: string;
          href: string;
          price: string;
          billingPeriod: string;
          period: string;
          yearlyPrice: string;
          yearlyBillingPeriod: string;
          features: string[];
          description: string;
          buttonText: string;
          isPopular: boolean;
        }[];
      }
    | {
        variant: "one-time";
        items: {
          name: string;
          href: string;
          price: string;
          unit: string;
          description?: string;
          features?: string[];
          buttonText: string;
        }[];
      }
  );
  faq?: {
    title?: string;
    subtitle?: string;
    items: {
      question: string;
      answer: React.ReactNode;
    }[];
  };
  blog?: {
    title: string;
    description?: string;
  };
  cta?: {
    title?: string;
    subtitle: ReactNode;
    buttonText: string;
    href: string;
  };
  footer: {
    termsOfUseAndPrivacyPolicy?: string;
    privacyPolicy?: string;
    termsOfService?: string;
    items: {
      title: string;
      links: {
        href: string;
        text: string;
        icon?: React.ReactNode;
      }[];
    }[];
  };
};
