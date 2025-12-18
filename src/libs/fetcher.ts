'use server';

import {redirect} from "next/navigation";
import {verifyAuth} from "@/libs/auth";

// eslint-disable-next-line
export const fetcher = async (method: string, path: string, body?: any) => {

  const auth = await verifyAuth();
  const res = await fetch(`${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${auth?.accessToken}`,
    }
  });
  if ((method === 'POST' && res.status === 401)) {
    redirect('/auth/login');
  }
  return res;
}