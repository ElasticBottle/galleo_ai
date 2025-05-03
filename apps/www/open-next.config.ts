import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";
const config = {
  default: {
    override: {
      wrapper: "aws-lambda-streaming",
    },
  },
  buildCommand:
    process.env.STAGE === "production" ? "pnpm build:prod" : "pnpm build:dev",
} satisfies OpenNextConfig;

export default config;
