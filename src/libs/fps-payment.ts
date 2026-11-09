import type {InvoiceDto} from '@/types/invoiceDto';

export type FpsPaymentDetails = {
  accountName: string;
  bank: 'boc' | 'hsbc';
  bankAccount: string;
  fpsId?: string;
};

export function getFpsPaymentDetails(courseCode: string): FpsPaymentDetails | null {
  const code = courseCode.trim().toUpperCase();
  if (code.startsWith('WTF')) {
    return {
      accountName: 'In Express Recreation Management (Hong Kong) Ltd',
      bank: 'boc',
      bankAccount: '012-611-2-058945-3',
      fpsId: '116641648',
    };
  }
  if (code.startsWith('YO')) {
    return {accountName: 'YOUTH OUTREACH', bank: 'hsbc', bankAccount: '195-9-036771'};
  }
  return null;
}

export function requiresFpsPayment(invoice: Pick<InvoiceDto, 'items'>) {
  return invoice.items.some(item => item.course?.acceptFpsPayment === true);
}

export const FPS_REFERENCE_MAX_BYTES = 5 * 1024 * 1024;
export const FPS_REFERENCE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export function isValidFpsReference(file: {size: number; type: string}) {
  return file.size > 0 && file.size <= FPS_REFERENCE_MAX_BYTES && FPS_REFERENCE_TYPES.includes(file.type);
}

export function isFpsPending(invoice: {fpsSubmittedAt?: string | null; fpsApprovedAt?: string | null; due: number}) {
  return !!invoice.fpsSubmittedAt && !invoice.fpsApprovedAt && invoice.due > 0;
}

export function canSubmitFpsPayment(invoice: InvoiceDto) {
  return invoice.isActive && invoice.due > 0 && !invoice.fpsSubmittedAt &&
    !invoice.stripeUrl && !invoice.bbmslId && !invoice.bbmslUrl &&
    invoice.items.length > 0 && invoice.items.every(item => item.course?.acceptFpsPayment === true);
}
