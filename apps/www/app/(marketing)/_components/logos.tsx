import { Marquee } from "@galleo/ui/components/ui/marquee";
import Image from "next/image";
import { siteConfig } from "~/lib/site-config";

export function Logos() {
  if (!siteConfig.socialProof) return null;
  return (
    <section id="logos">
      <div className="container mx-auto px-4 md:px-8">
        <h3 className="text-center font-semibold text-muted-foreground text-sm">
          {siteConfig.socialProof.title}
        </h3>
        <div className="relative pt-6">
          <Marquee
            className="max-w-full [--duration:40s]"
            repeat={4}
            pauseOnHover
          >
            {siteConfig.socialProof.icons.map(({ href, name }) => (
              <Image
                key={name}
                width={56}
                height={56}
                src={href}
                className="h-16 w-16 opacity-40 grayscale"
                alt={name}
              />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 right-0 left-0 h-full bg-gradient-to-r from-background via-transparent to-background" />
        </div>
      </div>
    </section>
  );
}
