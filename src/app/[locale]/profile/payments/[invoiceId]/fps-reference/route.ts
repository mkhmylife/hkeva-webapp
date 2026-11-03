import {fetcher} from '@/libs/fetcher';

export async function GET(_request: Request, {params}: {params: Promise<{invoiceId: string}>}) {
  const {invoiceId} = await params;
  if (!/^\d+$/.test(invoiceId) || !Number.isSafeInteger(Number(invoiceId)) || Number(invoiceId) <= 0) {
    return new Response(null, {status: 404});
  }
  const response = await fetcher('GET', `/app/invoice/${invoiceId}/fps-reference`);
  if (!response.ok) return new Response(null, {status: response.status, headers: {'Cache-Control': 'no-store'}});
  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment; filename="fps-reference"',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
