import type { Oauth2Token } from "@openauthjs/openauth/provider/oauth2";
import { type Result, err } from "@rectangular-labs/result";
import type { UserSubject } from "../subject";
import { getDiscordUser } from "./discord";
import { getGithubUser } from "./github";
import { getGoogleUser } from "./google";
import { getMicrosoftUser } from "./microsoft";

export async function getUserProfile(value: {
  provider: "github" | "discord" | "google" | "microsoft";
  tokenset: Oauth2Token;
}): Promise<Result<UserSubject, Error>> {
  switch (value.provider) {
    case "github":
      return await getGithubUser(value.tokenset.access);
    case "discord":
      return await getDiscordUser(value.tokenset?.access);
    case "google":
      return await getGoogleUser(value.tokenset.access);
    case "microsoft":
      return await getMicrosoftUser(value.tokenset.access);
    default: {
      const _neverReached: never = value.provider;
      return err(new Error(`Unsupported provider: ${_neverReached}`));
    }
  }
}
