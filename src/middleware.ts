import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  // // Retrieve the token value from cookies
  // const token = request.cookies.get("token")?.value;

  // // If no token is found and the path starts with /dashboard, redirect to the login page
  // if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
