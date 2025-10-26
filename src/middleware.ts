import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {decrypt} from "@/libs/session";

// import createMiddleware from 'next-intl/middleware';
// import {routing} from './i18n/routing';
// export default createMiddleware(routing);

const locales = ['zh-HK', 'en-HK'];

const protectedRoutes = ['/', '/enrollment', '/profile', '/notifications', "/settings"];
const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const fullPath = req.nextUrl.pathname;
  let path = fullPath;
  let activeLocale;
  for (const locale of locales) {
    if (fullPath.startsWith(`/${locale}`)) {
      path = fullPath.replace(`/${locale}`, '') || '/';
      activeLocale = locale;
      break;
    }
  }
  if (!activeLocale) {
    return NextResponse.redirect(new URL(`/zh-HK/${path}`, req.nextUrl));
  }

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.accessToken) {
    return NextResponse.redirect(new URL(`/${activeLocale}/auth/login`, req.nextUrl))
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/')
  ) {
    return NextResponse.redirect(new URL(`/${activeLocale}`, req.nextUrl));
  }

  return NextResponse.next()
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};