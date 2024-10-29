import { NextResponse } from 'next/server';
import { setCookie } from 'cookies-next';

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const refreshToken = searchParams.get('refreshToken');

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refreshTokens' }, { status: 400 });
  }

  setCookie('refreshToken', refreshToken, {
    req,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  return NextResponse.redirect(new URL('/', req.url));
}
