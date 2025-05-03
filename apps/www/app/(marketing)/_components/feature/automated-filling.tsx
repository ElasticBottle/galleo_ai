"use client";

import { AnimatedList } from "@galleo/ui/components/ui/animated-list";
import { cn } from "@galleo/ui/utils/cn";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: "Application Submitted",
    description: "Form TM4 filed with IPOS",
    time: "4 mth ago",
    icon: "📩",
    color: "#00C9A7",
  },
  {
    name: "Formalities Check",
    description: "Application under initial examination",
    time: "4 mth ago",
    icon: "📋",
    color: "#1E86FF",
  },
  {
    name: "Trademark Examination",
    description: "Detailed review of trademark requirements",
    time: "3 mth ago",
    icon: "🔍",
    color: "#FFB800",
  },
  {
    name: "Publication",
    description: "Published in Trade Marks Journal for 2 months",
    time: "2 mth ago",
    icon: "📢",
    color: "#FF3D71",
  },
  {
    name: "Registration Certificate",
    description: "Trademark successfully registered",
    time: "Now",
    icon: "✅",
    color: "#00C9A7",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto w-full cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre font-medium text-lg dark:text-white ">
            <span className="text-xs sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-gray-500 text-xs">{time}</span>
          </figcaption>
          <p className="font-normal text-xs sm:text-sm dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function AutomatedFilling({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-96 flex-col overflow-hidden rounded-lg bg-background md:border md:p-6 md:shadow-xl",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={`${item.name}-${idx}`} />
        ))}
      </AnimatedList>
    </div>
  );
}
