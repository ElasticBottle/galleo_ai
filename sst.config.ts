/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "galleo",
      removal: input?.stage === "production" ? "retain" : "remove",
      // protect: ["production"].includes(input?.stage),
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
    const isProduction = $app.stage === "production";
    const domain = (() => {
      if (isProduction) {
        return "galleo.ai";
      }
      if ($app.stage === "dev") {
        return "dev.galleoai.com";
      }
      return `${$app.stage}.dev.galleoai.com`;
    })();
    const frontendDomain = domain;
    const authDomain = isPermanentStage
      ? `auth.${domain}`
      : "auth.dev.galleoai.com";

    if (!process.env.CLOUDFLARE_ZONE_ID) {
      throw new Error("CLOUDFLARE_ZONE_ID is not set");
    }
    const dns = sst.cloudflare.dns({
      zone: process.env.CLOUDFLARE_ZONE_ID,
    });

    const ipMediaBucket = new sst.aws.Bucket("IpMarksMedia", {
      versioning: false,
      access: "public",
    });

    const serverEnv = parseServerEnv({
      ...process.env,
      NEXT_PUBLIC_BACKEND_URL:
        process.env.NEXT_PUBLIC_BACKEND_URL ?? `https://${frontendDomain}`, //this really is just the hostname
      NEXT_PUBLIC_AUTH_URL:
        process.env.NEXT_PUBLIC_AUTH_URL ?? `https://${authDomain}`,
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL ?? `https://${frontendDomain}`,
    });

    const router = isPermanentStage
      ? new sst.aws.Router("AppRouter", {
          domain: {
            name: domain,
            aliases: [`*.${domain}`],
            dns,
          },
        })
      : sst.aws.Router.get("AppRouter", "EL8QCPMFX80NG"); // the dev app

    const _frontend = new sst.aws.Nextjs("WWW", {
      path: "apps/www",
      link: [ipMediaBucket],
      environment: serverEnv,
      buildCommand: `STAGE=${$app.stage} pnpx open-next@latest build`,
      dev: {
        command: "pnpm dev",
      },
      server: {
        timeout: "60 seconds",
      },
      warm: isProduction ? 1 : 0,
      router: {
        instance: router,
        domain: frontendDomain,
      },
    });

    const { authDynamoTable, authIssuer: _ } = (() => {
      if (isPermanentStage) {
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
            router: {
              instance: router,
              domain: authDomain,
            },
            cors: false,
          },
        });
        return { authIssuer, authDynamoTable };
      }
      return { authIssuer: null, authDynamoTable: null };
    })();

    new sst.x.DevCommand("Packages", {
      dev: {
        autostart: true,
        command: "pnpm dev:packages",
      },
    });
    return {
      router: router.distributionID,
      authTable: authDynamoTable?.name,
      ipMediaBucketName: ipMediaBucket.name,
    };
  },
});
