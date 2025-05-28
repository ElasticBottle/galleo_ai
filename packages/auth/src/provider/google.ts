import { type Result, safe, safeFetch } from "@rectangular-labs/result";
import type { UserSubject } from "../subject";

interface GoogleApiResponse {
  sub: string; // Subject identifier - The ID of the user.
  name?: string | null;
  given_name?: string | null;
  family_name?: string | null;
  picture?: string | null;
  email?: string | null;
  email_verified?: boolean;
  locale?: string;
}

export async function getGoogleUser(
  accessToken: string,
): Promise<Result<UserSubject, Error>> {
  const userResponseResult = await safeFetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!userResponseResult.ok) {
    return userResponseResult;
  }

  const userResponse = userResponseResult.value;

  const userResult = await safe(
    () => userResponse.json() as Promise<GoogleApiResponse>,
  );

  if (!userResult.ok) {
    return userResult;
  }

  const user = userResult.value;

  // Determine the best name to use
  let displayName = user.name;
  if (!displayName) {
    if (user.given_name && user.family_name) {
      displayName = `${user.given_name} ${user.family_name}`;
    } else {
      displayName = user.given_name || user.family_name || user.email || ""; // Fallback to email if no name parts
    }
  }

  return {
    ok: true,
    value: {
      id: `google_${user.sub}`,
      name: displayName ?? "Unnamed User", // Provide a default if all name fields are null
      email: user.email && user.email_verified ? user.email : null,
      image: user.picture ?? null,
    },
  };
}
