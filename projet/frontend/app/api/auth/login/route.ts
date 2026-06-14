import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

  try {
    const body = await request.json();
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const token = data.data?.token as string | undefined;
    const user = data.data?.user;

    if (!token || !user) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid login response', code: 'INVALID_RESPONSE' } },
        { status: 500 },
      );
    }

    const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
    const maxAgeSeconds = parseExpiresIn(expiresIn);

    const nextResponse = NextResponse.json({ success: true, data: { user } });
    nextResponse.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: request.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeSeconds,
    });

    return nextResponse;
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Login failed', code: 'LOGIN_FAILED' } },
      { status: 500 },
    );
  }
}

function parseExpiresIn(value: string): number {
  const match = value.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60;

  const amount = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'd':
      return amount * 24 * 60 * 60;
    case 'h':
      return amount * 60 * 60;
    case 'm':
      return amount * 60;
    case 's':
      return amount;
    default:
      return 7 * 24 * 60 * 60;
  }
}
