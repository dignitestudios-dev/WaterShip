import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const isProfileCompleted = request.cookies.get("isProfileCompleted")?.value;

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isCompleteProfileRoute = pathname.startsWith("/complete-profile");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify-email");

  // 1. Unauthenticated users cannot access protected routes or complete-profile
  if ((isProtectedRoute || isCompleteProfileRoute) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Authenticated users with incomplete profile trying to access dashboard/protected routes
  if (isProtectedRoute && token && isProfileCompleted === "false") {
    return NextResponse.redirect(new URL("/complete-profile", request.url));
  }

  // 3. Authenticated users with completed profile trying to access complete-profile
  if (isCompleteProfileRoute && token && isProfileCompleted === "true") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. Authenticated users trying to access auth pages (login, register, verify-email)
  if (isAuthRoute && token) {
    if (isProfileCompleted === "false") {
      return NextResponse.redirect(new URL("/complete-profile", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images and static files with extensions (.svg, .png, .jpg, .js, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico)$).*)",
  ],
};
