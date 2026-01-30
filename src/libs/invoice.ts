'use server';

import {fetcher} from "@/libs/fetcher";
import {EnrollmentWithCountDto} from "@/types/enrollment";
import {InvoiceDto} from "@/types/invoiceDto";

export const getInvoice = async (id: number) => {
  const res = await fetcher('GET', `/app/invoice/${id}`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as InvoiceDto;
}

export const applyPointsInInvoice = async (id: number, points: number) => {
  const res = await fetcher('PUT', `/app/invoice/${id}/points`, {
    points,
  });
  if (!res.ok) {
    console.log(await res.text());
    throw new Error(res.statusText);
  }
  return await res.json() as InvoiceDto;
}

export const unapplyPointsInInvoice = async (id: number) => {
  const res = await fetcher('DELETE', `/app/invoice/${id}/points`);
  if (!res.ok) {
    console.log(await res.text());
    throw new Error(res.statusText);
  }
  return await res.json() as InvoiceDto;
}

export const payInvoice = async (id: number, isMock: boolean) => {
  const res = await fetcher('POST', `/app/invoice/${id}/pay`, {
    isMock,
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as { success: boolean; paymentUrl?: string };
}