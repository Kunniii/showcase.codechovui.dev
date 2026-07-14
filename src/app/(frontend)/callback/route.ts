import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const state = url.searchParams.get('state');

  const AUTH_URL = process.env.CODECHOVUI_AUTH_URL || 'https://auth.codechovui.dev';
  const AUTH_INTERNAL_URL = process.env.CODECHOVUI_AUTH_INTERNAL_URL || AUTH_URL;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';

  if (error) {
    console.error('OAuth Error:', error);
    return NextResponse.redirect(`${APP_URL}/?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${APP_URL}/`);
  }

  try {
    const tokenRes = await fetch(`${AUTH_INTERNAL_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.CODECHOVUI_APP_ID,
        client_secret: process.env.CODECHOVUI_APP_SECRET,
        code: code,
        redirect_uri: `${APP_URL}/callback`,
      }),
      cache: 'no-store',
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(tokenData.error || 'Failed to fetch access token');
    }

    // Redirect back to original page or home
    const response = NextResponse.redirect(`${APP_URL}${state || '/'}`);
    
    // Set cookie directly on the response object
    response.cookies.set('auth_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in || 7200,
    });
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (err: any) {
    console.error('OAuth token exchange error:', err);
    const errResponse = NextResponse.redirect(`${APP_URL}/?error=auth_failed`);
    errResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return errResponse;
  }
}
