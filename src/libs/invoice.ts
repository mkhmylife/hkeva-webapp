'use server';

import {fetcher} from "@/libs/fetcher";
import {InvoiceDto} from "@/types/invoiceDto";
import {isValidFpsReference} from '@/libs/fps-payment';

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

export const submitFpsReference = async (id: number, formData: FormData): Promise<
  {invoice: InvoiceDto; error?: never} | {invoice?: never; error: 'invalid-file' | 'unavailable' | 'upload-failed'}
> => {
  const file = formData.get('file');
  if (!(file instanceof File) || !isValidFpsReference(file)) {
    return {error: 'invalid-file'};
  }
  const res = await fetcher('POST', `/app/invoice/${id}/fps-reference`, formData);
  if (!res.ok) {
    if (res.status === 413 || res.status === 415) return {error: 'invalid-file'};
    return {error: [400, 403, 404, 409, 410].includes(res.status) ? 'unavailable' : 'upload-failed'};
  }
  return {invoice: await res.json() as InvoiceDto};
}
