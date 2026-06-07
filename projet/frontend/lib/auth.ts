export const AUTH_COOKIE_NAME = 'auth_token';

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
}

export function getAuthTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!match) return null;
  return decodeURIComponent(match.slice(AUTH_COOKIE_NAME.length + 1));
}
