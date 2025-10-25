'use server';

import {createSession, decrypt} from "@/libs/session";
import {cookies} from "next/headers";
import {cache} from "react";
import {redirect} from "next/navigation";
import {fetcher} from "@/libs/fetcher";

export const verifyAuth = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  if (!cookie) {
    return null;
  }

  const session = await decrypt(cookie)
  if (!session?.accessToken) {
    return null;
  }

  // try {
  //   await getMe();
  // } catch (e) {
  //   console.error("Failed to verify auth:", e);
  //   // If the token is invalid, we should clear the session
  //   const cookieStore = await cookies();
  //   cookieStore.delete('session');
  //   return null;
  // }

  return { accessToken: session.accessToken };
});

export const register = async (payload: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: string;
  referralCode?: string;
}) => {
  const res = await fetch(`${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const {message} = await res.json()
    throw new Error(message);
  }
  const { accessToken, refreshToken } = await res.json() as { accessToken: string; refreshToken: string };
  await createSession(accessToken);
}

export const login = async (payload: {
  phoneNumber: string;
  password: string;
}) => {
  const res = await fetch(`${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}/auth/student/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const { accessToken, id } = await res.json() as { accessToken: string; id: number };
  await createSession(accessToken);
  // return { accessToken, refreshToken }
}

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect(`/`);
}

export const forgotPasswordSendPin = async (payload: {
  phoneNumber: string;
}) => {
  const res = await fetch(`${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/send-pin`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
}

export const forgotPasswordVerifyPin = async (payload: {
  phoneNumber: string;
  pin: string;
}) => {
  const res = await fetch(`${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/verify-pin`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const { accessToken, refreshToken } = await res.json() as { accessToken: string; refreshToken: string };
  await createSession(accessToken);
  // return { accessToken, refreshToken }
}

export const resetPassword = async (payload: {
  phoneNumber: string;
  password: string;
}) => {
  const res = await fetcher('POST', `/auth/reset-password`, payload);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
}