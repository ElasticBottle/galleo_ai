import { issuer } from "@openauthjs/openauth";
import { DiscordProvider } from "@openauthjs/openauth/provider/discord";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { MicrosoftProvider } from "@openauthjs/openauth/provider/microsoft";
import { Select } from "@openauthjs/openauth/ui/select";
import { handle } from "hono/aws-lambda";
import { env } from "./env";
import { getUserProfile } from "./provider/get-profile";
import { subjects } from "./subject";

const authApp = issuer({
  subjects,
  select: Select({
    providers: {
      code: {
        display: "Code",
        hide: true,
      },
      discord: {
        display: "Discord",
        hide: true,
      },
      github: {
        display: "GitHub",
        hide: true,
      },
      microsoft: {
        display: "Microsoft",
      },
      google: {
        display: "Google",
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
    // google: GoogleProvider({
    //   clientID: env().GOOGLE_CLIENT_ID,
    //   clientSecret: env().GOOGLE_CLIENT_SECRET,
    //   scopes: ["email", "profile"],
    //   pkce: true,
    //   type: "code",
    // }),
    microsoft: MicrosoftProvider({
      tenant: "common",
      clientID: env().AZURE_CLIENT_ID,
      clientSecret: env().AZURE_CLIENT_SECRET,
      scopes: ["email", "profile", "offline_access", "openid", "User.Read"],
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
    favicon: "https://galleo.ai/favicon-32x32.png",
    logo: {
      dark: "https://galleo.ai/galleo-big-logo-dark.svg",
      light: "https://galleo.ai/galleo-big-logo-light.svg",
    },
    font: {
      family: "Inter",
      scale: "1",
    },
  },
  success: async (ctx, value) => {
    const userProfileResult = await getUserProfile(value);

    if (!userProfileResult.ok) {
      console.error(
        "Failed to fetch user profile:",
        userProfileResult.error.message,
      );
      // Return an actual Response object for errors
      return new Response(
        `Failed to fetch user profile: ${userProfileResult.error.message}`,
        { status: 500 },
      );
    }

    const userProfile = userProfileResult.value;

    return ctx.subject("user", userProfile);
  },
});

export const handler = handle(authApp);
