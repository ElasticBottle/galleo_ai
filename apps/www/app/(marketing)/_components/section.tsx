import { cn } from "@galleo/ui/utils/cn";

interface SectionProps {
  id?: string;
  title?: string | undefined;
  subtitle?: string | undefined;
  description?: string | undefined;
  children?: React.ReactNode;
  className?: string;
}

export function Section({
  id,
  title,
  subtitle,
  description,
  children,
  className,
}: SectionProps) {
  const sectionId = title ? title.toLowerCase().replace(/\s+/g, "-") : id;
  return (
    <section
      id={id || sectionId}
      className={cn("container relative max-w-7xl px-4", className)}
    >
      {(title || subtitle || description) && (
        <div className="flex w-full flex-col items-center space-y-4 pb-6 ">
          {title && (
            <h2 className="text-center font-medium font-mono text-primary text-sm uppercase tracking-wider">
              {title}
            </h2>
          )}
          {subtitle && (
            <h3 className="max-w-xs text-center font-semibold text-3xl sm:max-w-none sm:text-4xl md:text-5xl">
              {subtitle}
            </h3>
          )}
          {description && (
            <p className="max-w-2xl text-center text-lg text-muted-foreground leading-8">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
