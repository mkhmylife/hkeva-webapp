import { NextRequest, NextResponse } from 'next/server'
import {decrypt} from "@/libs/session";

// import createMiddleware from 'next-intl/middleware';
// import {routing} from './i18n/routing';
// export default createMiddleware(routing);

const locales = ['zh-HK', 'en-HK'];

const protectedRoutes = ['/', '/class', '/enrollment', '/profile', '/notification', '/settings'];
const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const fullPath = req.nextUrl.pathname;
  let path = fullPath;
  let activeLocale;
  for (const locale of locales) {
    if (fullPath === `/${locale}` || fullPath.startsWith(`/${locale}/`)) {
      path = fullPath.slice(locale.length + 1) || '/';
      activeLocale = locale;
      break;
    }
  }
  if (!activeLocale) {
    return NextResponse.redirect(new URL(`/zh-HK${path}${req.nextUrl.search}`, req.nextUrl));
  }

  const isProtectedRoute = protectedRoutes.some(route => {
    if (route === '/') return path === '/';
    return path === route || path.startsWith(route + '/');
  });
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'));

  // 3. Decrypt the session from the cookie
  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)
  const isServerAction = req.method === 'POST' && req.headers.has('next-action');

  // Let Server Actions use redirect() so Next.js sends an action redirect,
  // rather than returning an HTML login page to the action's fetch request.
  if (isServerAction) {
    return NextResponse.next();
  }

  // The API can reject an access token while the session JWT is still valid.
  // Clear it before the public-route redirect to avoid sending users back in.
  if (path === '/auth/login' && req.nextUrl.searchParams.get('reason') === 'session-expired') {
    const response = NextResponse.next();
    response.cookies.delete('session');
    return response;
  }

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.accessToken) {
    const loginUrl = new URL(`/${activeLocale}/auth/login`, req.nextUrl);
    if (cookie) loginUrl.searchParams.set('reason', 'session-expired');
    const response = NextResponse.redirect(loginUrl);
    if (cookie) response.cookies.delete('session');
    return response;
  }

  // 5. Redirect to / if the user is authenticated
  if (
    isPublicRoute &&
    session?.accessToken
  ) {
    return NextResponse.redirect(new URL(`/${activeLocale}`, req.nextUrl));
  }

  const response = NextResponse.next();
  if (cookie && !session) response.cookies.delete('session');
  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
