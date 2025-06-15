import { app } from "@galleo/backend";
import { parseServerEnv } from "@galleo/env";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { cookies } from "next/headers";

const handler = new OpenAPIHandler(app, {
  plugins: [
    new CORSPlugin({
      exposeHeaders: ["Content-Disposition"],
    }),
  ],
  interceptors: [onError((error) => console.error(error))],
});

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api",
    context: {
      env: parseServerEnv(process.env),
      cookies: await cookies(),
    },
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
