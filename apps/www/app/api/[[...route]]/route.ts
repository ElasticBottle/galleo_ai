import { app } from "@galleo/backend";
import { parseServerEnv } from "@galleo/env";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { ResponseHeadersPlugin } from "@orpc/server/plugins";

import { cookies } from "next/headers";
import { getApi } from "~/lib/server/api";

const handler = new OpenAPIHandler(app, {
  plugins: [
    new CORSPlugin({
      exposeHeaders: ["Content-Disposition"],
    }),
    new ResponseHeadersPlugin(),
  ],
  interceptors: [onError((error) => console.error(error))],
});

async function handleRequest(request: Request) {
  // hack to support streaming response
  if (request.url.includes("/chat/")) {
    const api = await getApi();
    const body = await request.json();
    const response = await api.chat.messageLawyer({
      teamId: body.teamId,
      chatId: body.id,
      messages: body.messages,
    });
    return new Response(response as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
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
