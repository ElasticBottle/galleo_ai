import { issuer } from "@openauthjs/openauth";
import { DiscordProvider } from "@openauthjs/openauth/provider/discord";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { Select } from "@openauthjs/openauth/ui/select";
import { handle } from "hono/aws-lambda";
import { env } from "./env";
import { subjects } from "./subject";

async function getUser(_email: string) {
  await Promise.resolve();
  // Get user from database and return user ID
  return "123";
}

const authApp = issuer({
  subjects,
  allow(input, req) {
    const url = new URL(req.url);
    const allowed =
      input.clientID === "galleo-backend" &&
      (url.host === "localhost" ||
        url.host.endsWith(process.env.NEXT_PUBLIC_BACKEND_URL ?? ""));
    return Promise.resolve(allowed);
  },
  select: Select({
    providers: {
      code: {
        display: "Code",
      },
      discord: {
        display: "Discord",
      },
      github: {
        display: "GitHub",
      },
    },
  }),
  providers: {
    github: GithubProvider({
      clientID: env().GITHUB_CLIENT_ID,
      clientSecret: env().GITHUB_CLIENT_SECRET,
      scopes: ["user:email", "read:user"],
      pkce: true,
      type: "code",
    }),
    discord: DiscordProvider({
      clientID: env().DISCORD_CLIENT_ID,
      clientSecret: env().DISCORD_CLIENT_SECRET,
      scopes: ["identify", "email"],
      pkce: true,
      type: "code",
    }),
  },
  theme: {
    title: "Galleo",
    primary: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    radius: "sm",
    favicon: "https://dev.galleoai.com/galleo-favicon.svg",
    logo: "https://dev.galleoai.com/galleo-favicon.svg",
    font: {
      family: "Inter",
      scale: "1",
    },
  },
  success: async (ctx, value) => {
    // throw new Error("Invalid provider");
    return ctx.subject("user", {
      id: await getUser(""),
      name: "",
      email: "",
      image: "",
    });
  },
});

export const handler = handle(authApp);
