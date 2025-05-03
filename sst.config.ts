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
    const authDomain = isPermanentStage
      ? `auth.${domain}`
      : "auth.dev.galleoai.com";
    const frontendDomain = domain;

    if (!process.env.CLOUDFLARE_ZONE_ID) {
      throw new Error("CLOUDFLARE_ZONE_ID is not set");
    }
    const dns = sst.cloudflare.dns({
      zone: process.env.CLOUDFLARE_ZONE_ID,
    });

    const serverEnv = parseServerEnv({
      ...process.env,
      NEXT_PUBLIC_BACKEND_URL:
        process.env.NEXT_PUBLIC_BACKEND_URL ?? `https://${backendDomain}`,
      NEXT_PUBLIC_AUTH_URL:
        process.env.NEXT_PUBLIC_AUTH_URL ?? `https://${authDomain}`,
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL ?? `https://${frontendDomain}`,
    });

    const backendApi = new sst.aws.Function("Hono", {
      handler: "apps/backend/src/routes/index.handler",
      environment: serverEnv,
      url: true,
      streaming: !$dev,
      timeout: "120 seconds",
    });

    const frontend = new sst.aws.Nextjs("WWW", {
      path: "apps/www",
      environment: serverEnv,
      dev: {
        command: "pnpm dev",
      },
    });

    const authDynamoTable = isPermanentStage
      ? new sst.aws.Dynamo("OpenAuthStorage", {
          fields: { pk: "string", sk: "string" },
          primaryIndex: { hashKey: "pk", rangeKey: "sk" },
          ttl: "expiry",
        })
      : sst.aws.Dynamo.get(
          "OpenAuthStorage",
          "galleo-dev-OpenAuthStorageTable-fnznmsdf",
        ); // use the dev table for non-permanent stages

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
    return {
      router: router.distributionID,
      authTable: authDynamoTable.name,
    };
  },
});
