import { NextRequest, NextResponse } from "next/server";
import { parseTenantFromHostname, isReservedTenantSlug } from "@procezly/shared";

export function middleware(req: NextRequest) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "procezly.io";
  const host = (req.headers.get("host") || "").split(",")[0].trim().toLowerCase();
  const tenant = parseTenantFromHostname(host, rootDomain);

  if (tenant && !isReservedTenantSlug(tenant.slug)) {
    const url = req.nextUrl.clone();
    if (url.pathname === "/") {
      url.pathname = "/app";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
