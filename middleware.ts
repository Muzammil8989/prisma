import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwtToken } from "./src/lib/jwt"

// Define which routes are protected (require authentication)
const protectedRoutes = ["/dashboard"]

// Define which routes are for non-authenticated users only
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value

  // Check if the user is authenticated
  const isAuthenticated = token && verifyJwtToken(token)

  // If the route is protected and the user is not authenticated, redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // If the route is for non-authenticated users and the user is authenticated, redirect to dashboard
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

