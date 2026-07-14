import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const referer = req.headers.get('referer');
  
  const cookieStore = await cookies();
  // Next.js requires setting the cookie with a past expiration date to delete it
  cookieStore.delete('auth_token');

  return NextResponse.redirect(new URL(referer || '/', req.url));
}
