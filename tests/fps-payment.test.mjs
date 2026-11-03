import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import test from 'node:test';
import {loadSource} from './helpers/load-source.mjs';

const require = createRequire(import.meta.url);
const React = require('react');
const jsxRuntime = require('react/jsx-runtime');
const {renderToStaticMarkup} = require('react-dom/server');
const fps = loadSource('src/libs/fps-payment.ts', {});
const invoice = {
  id: 42, isActive: true, due: 800, total: 800, paid: 0, source: 'App',
  updatedAt: new Date().toISOString(),
  items: [{course: {id: 12, acceptFpsPayment: true}}],
};
const translations = (namespace) => (key) => namespace ? `${namespace}.${key}` : key;
const componentImports = {
  react: React,
  'react/jsx-runtime': jsxRuntime,
  'next-intl': {useTranslations: translations, useLocale: () => 'zh-HK'},
  'next/navigation': {unstable_rethrow: require('next/navigation').unstable_rethrow},
  '@/libs/invoice': {},
  '@/libs/fps-payment': fps,
};
const FpsPayment = loadSource('src/components/fps-payment.tsx', componentImports).default;

test('FPS is available only for an active unpaid invoice made entirely of eligible courses before online payment starts', () => {
  assert.equal(fps.canSubmitFpsPayment(invoice), true);
  for (const changes of [
    {isActive: false}, {due: 0}, {items: []},
    {items: [{course: {acceptFpsPayment: false}}]},
    {items: [...invoice.items, {service: {id: 5}}]},
    {stripeUrl: 'https://pay.example/42'}, {bbmslId: 'online-payment'},
    {fpsSubmittedAt: new Date().toISOString()},
  ]) {
    assert.equal(fps.canSubmitFpsPayment({...invoice, ...changes}), false, JSON.stringify(changes));
  }
});

test('payment proof must be a nonempty supported image or PDF no larger than 5 MB', () => {
  for (const type of ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']) {
    assert.equal(fps.isValidFpsReference({type, size: 5 * 1024 * 1024}), true);
  }
  for (const file of [
    {type: 'application/pdf', size: 0},
    {type: 'application/pdf', size: 5 * 1024 * 1024 + 1},
    {type: 'image/svg+xml', size: 10}, {type: 'text/html', size: 10},
  ]) assert.equal(fps.isValidFpsReference(file), false);
});

test('FPS upload form requires a reference and displays the provided FPS ID and account name', () => {
  const html = renderToStaticMarkup(React.createElement(FpsPayment, {
    invoice, details: {id: 'TESTINGID', accountName: 'Test account'},
    disabled: false, onSubmitted: () => {}, onBusyChange: () => {},
  }));
  assert.match(html, /TESTINGID/);
  assert.match(html, /Test account/);
  assert.match(html, /type="file"[^>]*required=""/);
  assert.match(html, /type="submit" disabled=""/);
  assert.match(html, /FpsPayment.review-notice/);
});

const Checkout = loadSource('src/components/checkout.tsx', {
  ...componentImports,
  'react-hook-form': require('react-hook-form'),
  'lucide-react': {Pencil: 'span'},
  '@/i18n/navigation': {useRouter: () => ({replace: () => {}})},
  '@/libs/course': {},
  moment: {default: require('moment')},
  '@/components/fps-payment': {default: FpsPayment},
  '@/components/invoice-countdown': {default: () => React.createElement('p', null, 'expiry countdown')},
  '@/types/enrollment': {LessonEnrollmentStatus: {InvoiceSwappedAsPoint: 'InvoiceSwappedAsPoint'}},
}).default;

function checkoutHtml(currentInvoice) {
  return renderToStaticMarkup(React.createElement(Checkout, {
    invoice: currentInvoice, course: {acceptFpsPayment: true}, deductibles: [],
    fpsDetails: {id: 'TESTINGID'},
  }));
}

test('checkout offers FPS for eligible courses alongside online payment', () => {
  const html = checkoutHtml(invoice);
  assert.match(html, /name="payment-method" value="fps"/);
  assert.match(html, /Checkout.online-payment/);
  const unavailable = checkoutHtml({...invoice, items: [{course: {acceptFpsPayment: false}}]});
  assert.doesNotMatch(unavailable, /value="fps"/);
  assert.match(unavailable, /ProfilePayments.pay-now/);
});

test('pending FPS checkout remains awaiting review after normal expiry, with no payment, points or countdown controls', () => {
  const pending = {...invoice, fpsSubmittedAt: '2026-01-01T00:00:00Z', fpsReferenceFilename: 'receipt.pdf', updatedAt: '2026-01-01T00:00:00Z'};
  assert.equal(fps.isFpsPending(pending), true);
  const html = checkoutHtml(pending);
  assert.match(html, /FpsPayment.pending-title/);
  assert.match(html, /receipt.pdf/);
  assert.match(html, /href="\/zh-HK\/profile\/payments\/42\/fps-reference"/);
  assert.doesNotMatch(html, /ProfilePayments.pay-now|Checkout.use-points|expiry countdown|InvoiceCountdown.expired|type="file"/);
  const paid = checkoutHtml({...pending, due: 0, paid: 800, fpsApprovedAt: new Date().toISOString()});
  assert.match(paid, /ProfilePayments.paid/);
  assert.doesNotMatch(paid, /FpsPayment.pending-title|ProfilePayments.pay-now/);
});

test('FPS server action forwards a real multipart reference and returns an unpaid pending invoice', async () => {
  const pending = {...invoice, fpsSubmittedAt: new Date().toISOString()};
  let requests = 0;
  const api = loadSource('src/libs/invoice.ts', {
    '@/libs/fps-payment': fps,
    '@/libs/fetcher': {fetcher: async (method, path, body) => {
      requests++;
      assert.equal(method, 'POST');
      assert.equal(path, '/app/invoice/42/fps-reference');
      assert.ok(body instanceof FormData);
      assert.equal(body.get('file').name, 'receipt.pdf');
      return Response.json(pending);
    }},
  }, {File, FormData});
  assert.equal((await api.submitFpsReference(42, new FormData())).error, 'invalid-file');
  assert.equal(requests, 0);
  const data = new FormData();
  data.set('file', new File(['%PDF-1.4 reference'], 'receipt.pdf', {type: 'application/pdf'}));
  const result = await api.submitFpsReference(42, data);
  assert.equal(result.invoice.due, 800);
  assert.equal(result.invoice.paid, 0);
  assert.equal(result.invoice.fpsSubmittedAt, pending.fpsSubmittedAt);
  assert.equal(requests, 1);
});

test('multipart API uploads retain authentication and let fetch provide the boundary', async () => {
  const data = new FormData();
  data.set('file', new File(['proof'], 'proof.png', {type: 'image/png'}));
  const {fetcher} = loadSource('src/libs/fetcher.ts', {
    'next/navigation': {redirect: () => assert.fail('Authenticated request must not redirect')},
    '@/libs/auth': {verifyAuth: async () => ({accessToken: 'test-token'})},
    'next-intl/server': {getLocale: async () => 'zh-HK'},
    'next/headers': {},
  }, {
    FormData,
    process: {env: {API_URL: 'https://api.example'}},
    fetch: async (url, options) => {
      assert.equal(url, 'https://api.example/app/invoice/42/fps-reference');
      assert.equal(options.body, data);
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      assert.equal(options.headers['Content-Type'], undefined);
      assert.match(new Request(url, options).headers.get('Content-Type'), /^multipart\/form-data; boundary=/);
      return Response.json(invoice);
    },
  });
  await fetcher('POST', '/app/invoice/42/fps-reference', data);
});

test('reference download proxy preserves private streaming and never exposes storage keys', async () => {
  const {GET} = loadSource('src/app/[locale]/profile/payments/[invoiceId]/fps-reference/route.ts', {
    '@/libs/fetcher': {fetcher: async (method, path) => {
      assert.equal(method, 'GET');
      assert.equal(path, '/app/invoice/42/fps-reference');
      return new Response('%PDF-1.4 proof', {headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="receipt.pdf"',
      }});
    }},
  }, {Response});
  const response = await GET(null, {params: Promise.resolve({invoiceId: '42'})});
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(response.headers.get('Content-Disposition'), 'attachment; filename="receipt.pdf"');
  assert.equal(await response.text(), '%PDF-1.4 proof');
  const invalid = await GET(null, {params: Promise.resolve({invoiceId: '../another'})});
  assert.equal(invalid.status, 404);
});
