import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: session } = await supabase.auth.getSession();

  const isAuthenticated = session?.session;
  const url = req.nextUrl;
  const isDashboardRoute = url.pathname.startsWith("/dashboard");

  // Redirect unauthenticated users to login if they try to access the dashboard
  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  return NextResponse.next();
}

// Apply middleware only to dashboard-related pages
export const config = {
  matcher: ["/dashboard/:path*"],
};
