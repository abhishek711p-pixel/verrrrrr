import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

  if (isAuthPage) {
    if (isAuth) {
      if (token.role === 'TEACHER') {
        return NextResponse.redirect(new URL('/teacher', req.url));
      } else {
        return NextResponse.redirect(new URL('/student', req.url));
      }
    }
    return null;
  }

  if (!isAuth && (req.nextUrl.pathname.startsWith('/student') || req.nextUrl.pathname.startsWith('/teacher'))) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
  }

  if (isAuth) {
    if (req.nextUrl.pathname.startsWith('/student') && token.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/teacher', req.url));
    }
    if (req.nextUrl.pathname.startsWith('/teacher') && token.role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/student', req.url));
    }
  }
}

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*', '/login', '/register'],
};
