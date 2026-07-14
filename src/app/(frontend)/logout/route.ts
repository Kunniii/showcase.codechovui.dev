import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const referer = req.headers.get('referer');
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';
  
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');

  const redirectUrl = referer && referer.startsWith(APP_URL) ? referer : `${APP_URL}/`;
  
  const response = NextResponse.redirect(redirectUrl);
  
  // Prevent browser from caching this redirect, ensuring the cookie is always deleted
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}
