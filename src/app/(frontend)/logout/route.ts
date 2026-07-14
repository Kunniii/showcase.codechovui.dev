import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const referer = req.headers.get('referer');
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';
  
  const cookieStore = await cookies();
  cookieStore.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Immediately expire
  });

  if (referer && referer.startsWith(APP_URL)) {
    return NextResponse.redirect(referer);
  }
  return NextResponse.redirect(`${APP_URL}/`);
}
