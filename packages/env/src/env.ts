import { type } from "arktype";

const clientSchema = {
  NEXT_PUBLIC_APP_URL: "string>1",
  NEXT_PUBLIC_BACKEND_URL: "string>1",
  NEXT_PUBLIC_AUTH_URL: "string>1",
  NEXT_PUBLIC_POSTHOG_KEY: "string>1",
  NEXT_PUBLIC_POSTHOG_UI_HOST: "string>1",
} as const;

const ClientEnv = type(clientSchema);

export type ClientEnv = typeof ClientEnv.infer;
type ExplicitPartial<T> = {
  [K in keyof T]: T[K] | undefined;
};
export const parseClientEnv = (env: ExplicitPartial<ClientEnv>) => {
  const result = ClientEnv(env);
  if (result instanceof type.errors) {
    throw new Error(result.summary);
  }
  return result;
};

const ServerEnv = type({
  "...": clientSchema,
  // delete all non-symbolic keys other than "onlyPreservedStringKey"
  "+": "delete",
  "[symbol]": "unknown",
  DATABASE_URL: "string>1",
  GOOGLE_GENERATIVE_AI_API_KEY: "string>1",
  DISCORD_CLIENT_ID: "string>1",
  DISCORD_CLIENT_SECRET: "string>1",
  GITHUB_CLIENT_ID: "string>1",
  GITHUB_CLIENT_SECRET: "string>1",
});
export const parseServerEnv = (env: unknown) => {
  const result = ServerEnv(env);
  if (result instanceof type.errors) {
    throw new Error(result.summary);
  }
  return result;
};

export type ServerEnv = typeof ServerEnv.infer;
