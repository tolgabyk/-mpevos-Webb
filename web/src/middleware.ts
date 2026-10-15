import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.headers.get("x-impevos-rewritten") === "1") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-impevos-rewritten", "1");

  if (pathname === "/tr" || pathname.startsWith("/tr/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/tr/, "") || "/";
    return NextResponse.redirect(url);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    requestHeaders.set("x-locale", "en");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  requestHeaders.set("x-locale", "tr");
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/tr" : `/tr${pathname}`;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next|opengraph-image|twitter-image|.*\\..*).*)"],
};
