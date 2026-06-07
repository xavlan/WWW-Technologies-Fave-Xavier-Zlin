import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'auth_token';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!secret) {
    return new Uint8Array();
  }
  return new TextEncoder().encode(secret);
}

async function isValidToken(token: string): Promise<boolean> {
  try {
    const secret = getJwtSecret();
    if (secret.length === 0) {
      return false;
    }
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token || !(await isValidToken(token))) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/admin/login') {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token && (await isValidToken(token))) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
