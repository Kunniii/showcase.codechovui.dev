import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  console.log('[LOGOUT] Route hit. URL:', req.url);
  console.log('[LOGOUT] Cookies received from browser:', req.headers.get('cookie'));
  
  const referer = req.headers.get('referer');
  console.log('[LOGOUT] Referer:', referer);
  
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';
  console.log('[LOGOUT] APP_URL:', APP_URL);
  
  const redirectUrl = referer && referer.startsWith(APP_URL) ? referer : `${APP_URL}/`;
  console.log('[LOGOUT] Redirecting to:', redirectUrl);
  
  const response = NextResponse.redirect(redirectUrl);
  
  // Delete the cookie using Next.js native delete method on the response object
  response.cookies.delete('auth_token');
  console.log('[LOGOUT] Added response.cookies.delete(auth_token)');
  
  // Prevent browser from caching this redirect, ensuring the cookie is always deleted
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}
