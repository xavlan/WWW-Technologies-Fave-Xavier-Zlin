import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });

  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
