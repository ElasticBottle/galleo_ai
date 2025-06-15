import { getCookies, getEnv } from "../orpc/routers";

export function setSession(accessToken?: string, refreshToken?: string) {
  const cookies = getCookies();
  const env = getEnv();
  if (accessToken) {
    cookies.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: env.NEXT_PUBLIC_APP_URL.includes("localhost")
        ? "localhost"
        : `.${env.NEXT_PUBLIC_APP_URL.replace("https://", "")}`,
      maxAge: 34560000,
    });
  }
  if (refreshToken) {
    cookies.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: env.NEXT_PUBLIC_APP_URL.includes("localhost")
        ? "localhost"
        : `.${env.NEXT_PUBLIC_APP_URL.replace("https://", "")}`,
      maxAge: 34560000,
    });
  }
}

export function deleteSession() {
  const cookies = getCookies();
  const accessToken = cookies.delete("access_token");
  const refreshToken = cookies.delete("refresh_token");
  console.log("deleted new", { accessToken, refreshToken });
  return !!accessToken && !!refreshToken;
}
