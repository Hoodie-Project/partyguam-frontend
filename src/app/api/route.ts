import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const refreshToken = searchParams.get('token');

  console.log('refreshToken >> ', refreshToken);

  // 이미 쿠키에 설정된 경우 리다이렉트하지 않고 페이지 반환
  const cookies = req.headers.get('cookie');
  if (cookies?.includes('refreshToken')) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // refreshToken이 없는 경우에만 '/'로 리다이렉트
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // refreshToken이 있는 경우에만 쿠키 설정 및 /home으로 리다이렉트
  const response = NextResponse.redirect(new URL('/home', req.url));
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NEXT_PUBLIC_ENV === 'production' ? 'strict' : 'none',
    path: '/',
  });

  return response;
}
