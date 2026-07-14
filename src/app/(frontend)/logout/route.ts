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
  
  // Return a 200 OK HTML page that immediately redirects using meta refresh.
  // This bypasses any Next.js/Browser quirks with 307 redirects ignoring Set-Cookie headers.
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=${redirectUrl}">
        <title>Logging out...</title>
      </head>
      <body>
        <p>Đang đăng xuất...</p>
        <script>
          console.log('[CLIENT] Logout page rendered. Redirecting to:', '${redirectUrl}');
          window.location.href = '${redirectUrl}';
        </script>
      </body>
    </html>
  `;

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
  
  // Delete the cookie
  response.cookies.delete('auth_token');
  console.log('[LOGOUT] Emitting 200 OK with meta refresh and Set-Cookie for deletion');
  
  return response;
}
