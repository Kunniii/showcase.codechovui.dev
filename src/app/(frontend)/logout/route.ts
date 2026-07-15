import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const referer = req.headers.get('referer')
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'

  const redirectUrl = referer && referer.startsWith(APP_URL) ? referer : `${APP_URL}/`

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
  `

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })

  // Delete the cookie across all possible domains with the exact Secure flag
  const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure;' : ''
  const baseCookie = `auth_token=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=lax; ${secureFlag}`

  response.headers.append('Set-Cookie', baseCookie)
  response.headers.append('Set-Cookie', `${baseCookie} Domain=showcase.codechovui.dev;`)
  response.headers.append('Set-Cookie', `${baseCookie} Domain=.codechovui.dev;`)

  return response
}
