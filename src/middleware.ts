import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "linktrace-super-secret-key-change-in-production-32-chars-long"
);

const PROTECTED_ROUTES = [
  "/dashboard",
  "/links",
  "/campaigns",
  "/analytics",
  "/utm",
  "/settings",
];

const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("linktrace_session")?.value;

  let isValidSession = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // If trying to access protected route without valid session, redirect to login
  if (isProtectedRoute && !isValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and visiting login or register, redirect to dashboard
  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/links/:path*",
    "/campaigns/:path*",
    "/analytics/:path*",
    "/utm/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
