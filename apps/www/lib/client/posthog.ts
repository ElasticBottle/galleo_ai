import posthog from "posthog-js";
import { env } from "../env";

export function getPosthog() {
  if (typeof window === "undefined") return posthog;
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: env.NEXT_PUBLIC_POSTHOG_UI_HOST,
  });
  return posthog;
}
