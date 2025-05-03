/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "galleo",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: input.stage === "production" ? "galleo-prod" : "galleo-dev",
        },
      },
    };
  },
  async run() {
    const { parseServerEnv } = await import("@galleo/env");

    const isPermanentStage = ["production", "dev"].includes($app.stage);
    const domain =
      $app.stage === "production"
        ? "galleoai.com"
        : $app.stage === "dev"
          ? "dev.galleoai.com"
          : `${$app.stage}.dev.galleoai.com`;
    const backendDomain = `${domain}/api`;
    const authDomain = subdomain({ name: "auth", domain, isPermanentStage });
    const frontendDomain = domain;

    if (!process.env.CLOUDFLARE_ZONE_ID) {
      throw new Error("CLOUDFLARE_ZONE_ID is not set");
    }
    const dns = sst.cloudflare.dns({
      zone: process.env.CLOUDFLARE_ZONE_ID,
    });

    const serverEnv = parseServerEnv({
      ...process.env,
      VITE_BACKEND_URL: backendDomain,
      VITE_AUTH_URL: authDomain,
      VITE_APP_URL: frontendDomain,
    });
    const envString = Object.entries(serverEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join(" ");

    const backendApi = new sst.aws.Function("Hono", {
      handler: "apps/backend/src/routes/index.handler",
      environment: serverEnv,
      url: true,
      streaming: !$dev,
      timeout: "120 seconds",
    });

    const frontend = new sst.aws.StaticSite("WWW", {
      path: "apps/www",
      build: {
        command:
          $app.stage === "production"
            ? `${envString} pnpm build:prod`
            : `${envString} pnpm build:dev`,
        output: "dist",
      },
      dev: {
        command: "pnpm dev",
      },
    });

    const authDynamoTable = new sst.aws.Dynamo("OpenAuthStorage", {
      fields: { pk: "string", sk: "string" },
      primaryIndex: { hashKey: "pk", rangeKey: "sk" },
      ttl: "expiry",
    });
    const authIssuer = new sst.aws.Function("OpenAuthIssuer", {
      handler: "packages/auth/src/index.handler",
      link: [authDynamoTable],
      environment: {
        ...serverEnv,
        OPENAUTH_STORAGE: $jsonStringify({
          type: "dynamo",
          options: { table: authDynamoTable.name },
        }),
      },
      url: {
        cors: false,
      },
    });

    const router = isPermanentStage
      ? new sst.aws.Router("AppRouter", {
          domain: {
            name: domain,
            aliases: [`*.${domain}`],
            dns,
          },
        })
      : sst.aws.Router.get("AppRouter", "E2JNCC3RK7KT1V"); // the dev app router
    router.route(frontendDomain, frontend.url);
    router.route(backendDomain, backendApi.url, {
      readTimeout: "30 seconds",
      keepAliveTimeout: "30 seconds",
    });
    router.route(authDomain, authIssuer.url);

    new sst.x.DevCommand("Packages", {
      dev: {
        autostart: true,
        command: "pnpm dev:packages",
      },
    });
  },
});

function subdomain({
  name,
  domain,
  isPermanentStage,
}: { name: string; domain: string; isPermanentStage: boolean }) {
  if (isPermanentStage) return `${name}.${domain}`;
  return `${name}-${domain}`;
}
