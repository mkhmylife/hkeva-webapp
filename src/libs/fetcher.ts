'use server';

import {redirect} from "next/navigation";
import {verifyAuth} from "@/libs/auth";
import {getLocale} from "next-intl/server";
import {cookies, headers} from "next/headers";

async function redirectToLogin(): Promise<never> {
  const locale = await getLocale();
  // Actions can clear cookies immediately; renders clear them in middleware
  // on the login destination because Server Components cannot modify cookies.
  if ((await headers()).has('next-action')) {
    (await cookies()).delete('session');
  }
  redirect(`/${locale}/auth/login?reason=session-expired`);
}

// eslint-disable-next-line
export const fetcher = async (method: string, path: string, body?: any) => {

  const auth = await verifyAuth();
  if (!auth?.accessToken) {
    await redirectToLogin();
  }
  const res = await fetch(`${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${auth?.accessToken}`,
    }
  });
  if (res.status === 401) {
    await redirectToLogin();
  }
  return res;
}
