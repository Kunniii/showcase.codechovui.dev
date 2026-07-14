import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const state = url.searchParams.get('state');

  const AUTH_URL = process.env.CODECHOVUI_AUTH_URL || 'https://auth.codechovui.dev';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';

  if (error) {
    console.error('OAuth Error:', error);
    return NextResponse.redirect(`${APP_URL}/?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${APP_URL}/`);
  }

  try {
    const tokenRes = await fetch(`${AUTH_URL}/oauth/token`, {
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

    // Set cookie on the response
    const cookieStore = await cookies();
    cookieStore.set('auth_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in || 7200,
    });

    // Redirect back to original page or home
    return NextResponse.redirect(`${APP_URL}${state || '/'}`);
  } catch (err: any) {
    console.error('OAuth token exchange error:', err);
    return NextResponse.redirect(`${APP_URL}/?error=auth_failed`);
  }
}
