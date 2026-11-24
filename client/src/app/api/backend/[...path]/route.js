import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const ALLOWED_METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE"];
const METHODS_WITH_BODY = ["POST", "PATCH", "PUT", "DELETE"];

function jsonError(message, status) {
  return NextResponse.json(
    {
      status: "error",
      message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

function getBackendUrl(path, search) {
  const baseUrl = BACKEND_API_URL.replace(/\/+$/, "");
  const cleanPath = path.map(encodeURIComponent).join("/");

  return `${baseUrl}/${cleanPath}${search}`;
}

async function proxyRequest(request, context) {
  try {
    if (!BACKEND_API_URL) {
      console.error("BACKEND_API_URL is not configured");
      return jsonError("Backend server is not configured", 500);
    }

    if (!FRONTEND_URL) {
      console.error("FRONTEND_URL is not configured");
      return jsonError("Frontend URL is not configured", 500);
    }

    const method = request.method.toUpperCase();

    if (!ALLOWED_METHODS.includes(method)) {
      return jsonError("Method not allowed", 405);
    }

    const { path = [] } = await context.params;

    if (path.length < 2 ||path[0] !== "api" ||path[1] !== "v1") {
      return jsonError("Invalid API path", 404);
    }

    const requestOrigin = request.headers.get("origin");
    const trustedOrigin = new URL(FRONTEND_URL).origin;

    if (METHODS_WITH_BODY.includes(method)) {
      if (!requestOrigin) {
        return jsonError("Missing request origin", 403);
      }

      let incomingOrigin;

      try {
        incomingOrigin = new URL(requestOrigin).origin;
      } catch {
        return jsonError("Invalid request origin", 403);
      }

      if (incomingOrigin !== trustedOrigin) {
        return jsonError("Forbidden request origin", 403);
      }
    }

    const incomingUrl = new URL(request.url);
    const backendUrl = getBackendUrl(path, incomingUrl.search);

    const headers = new Headers();

    const contentType = request.headers.get("content-type");
    const accept = request.headers.get("accept");
    const cookie = request.headers.get("cookie");

    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    if (accept) {
      headers.set("Accept", accept);
    }

    if (cookie) {
      headers.set("Cookie", cookie);
    }

    headers.set("Origin", trustedOrigin);

    const body = METHODS_WITH_BODY.includes(method) ? await request.arrayBuffer() : undefined;

    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
      signal: request.signal,
    });

    const responseHeaders = new Headers();

    const responseContentType = backendResponse.headers.get("content-type");
    const cacheControl = backendResponse.headers.get("cache-control");

    if (responseContentType) {
      responseHeaders.set("Content-Type", responseContentType);
    }

    responseHeaders.set("Cache-Control", cacheControl || "no-store");

    const setCookies = backendResponse.headers.getSetCookie?.() || [];

    for (const cookieValue of setCookies) {
      responseHeaders.append("Set-Cookie", cookieValue);
    }

    const responseBody =
      method === "HEAD" ||
      backendResponse.status === 204 ||
      backendResponse.status === 304 ? null : await backendResponse.arrayBuffer();

    return new Response(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("BFF proxy error:", error);
    return jsonError("Unable to communicate with backend server", 502);
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;