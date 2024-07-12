// middleware.ts
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const authResult = await auth();

  if (authResult instanceof Response) return authResult;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth();
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/admin/:path*'
  ],
};