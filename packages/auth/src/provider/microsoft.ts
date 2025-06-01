import { type Result, safe, safeFetch } from "@rectangular-labs/result";
import type { UserSubject } from "../subject";

// Based on common fields from https://learn.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0
interface MicrosoftGraphApiResponse {
  id: string;
  displayName?: string | null;
  givenName?: string | null;
  surname?: string | null;
  mail?: string | null; // Preferred for email
  userPrincipalName?: string | null; // Can also be used as email, often is
}

export async function getMicrosoftUser(
  accessToken: string,
): Promise<Result<UserSubject, Error>> {
  const userResponseResult = await safeFetch(
    "https://graph.microsoft.com/v1.0/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ConsistencyLevel: "eventual",
      },
    },
  );

  if (!userResponseResult.ok) {
    return userResponseResult;
  }

  const userResponse = userResponseResult.value;
  const userResult = await safe(
    () => userResponse.json() as Promise<MicrosoftGraphApiResponse>,
  );

  if (!userResult.ok) {
    return userResult;
  }

  const user = userResult.value;
  console.log("user", user);

  const displayName = (() => {
    if (user.displayName) {
      return user.displayName;
    }
    if (user.givenName && user.surname) {
      return `${user.givenName} ${user.surname}`;
    }
    return (
      user.givenName ??
      user.surname ??
      user.mail ??
      user.userPrincipalName ??
      "Unnamed User"
    );
  })();

  const email = user.mail || user.userPrincipalName;

  return {
    ok: true,
    value: {
      id: `microsoft_${user.id}`,
      name: displayName,
      email: email ?? null,
      image: `https://graph.microsoft.com/v1.0/me/photos/64x64/$value#${accessToken}`,
    },
  };
}
