import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, computeSessionToken } from "@/lib/admin-auth";

const PROTECTED_API_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isProtectedApi =
    ((pathname.startsWith("/api/championships") || pathname.startsWith("/api/federations")) &&
      PROTECTED_API_METHODS.has(request.method)) ||
    (pathname.startsWith("/api/feedback") && request.method !== "POST");

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const expected = await computeSessionToken();

  if (cookie === expected) {
    return NextResponse.next();
  }

  if (isAdminPage) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/championships/:path*",
    "/api/federations/:path*",
    "/api/feedback/:path*",
  ],
};
