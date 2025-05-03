import { getContext } from "hono/context-storage";
import { setCookie } from "hono/cookie";
import { env } from "../../../../lib/env";

export function setSession(accessToken?: string, refreshToken?: string) {
  const context = getContext();
  if (accessToken) {
    setCookie(context, "access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      domain: env().NEXT_PUBLIC_APP_URL.includes("localhost")
        ? "localhost"
        : `.${env().NEXT_PUBLIC_APP_URL.replace("https://", "")}`,
      maxAge: 34560000,
    });
  }
  if (refreshToken) {
    setCookie(context, "refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      domain: env().NEXT_PUBLIC_APP_URL.includes("localhost")
        ? "localhost"
        : `.${env().NEXT_PUBLIC_APP_URL.replace("https://", "")}`,
      maxAge: 34560000,
    });
  }
}
