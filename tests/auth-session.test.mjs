import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import test from 'node:test';
import * as jose from 'jose';
import {loadSource} from './helpers/load-source.mjs';

const require = createRequire(import.meta.url);
const {NextRequest, NextResponse} = require('next/server');
const {redirect, unstable_rethrow} = require('next/navigation');

const writtenCookies = [];
const logs = [];
const session = loadSource('src/libs/session.ts', {
  'server-only': {},
  'next/headers': {cookies: async () => ({set: (...args) => writtenCookies.push(args)})},
  jose,
}, {console: {error: (...args) => logs.push(args), log: (...args) => logs.push(args)}});
const {default: middleware} = loadSource('src/middleware.ts', {
  'next/server': {NextRequest, NextResponse},
  '@/libs/session': session,
});

const validToken = await session.encrypt({accessToken: 'test-access-token'});
const expiredToken = await session.encrypt({accessToken: 'test-access-token'}, new Date(Date.now() - 60_000));

function request(path, token, options = {}) {
  const headers = new Headers(options.headers);
  if (token) headers.set('cookie', `session=${token}`);
  return new NextRequest(`https://app.example${path}`, {...options, headers});
}

test('JWT, payload and cookie expire at the same time after seven days', async () => {
  await session.createSession('test-access-token');
  const [name, token, options] = writtenCookies.at(-1);
  const payload = await session.decrypt(token);
  assert.equal(name, 'session');
  assert.equal(payload.exp, Math.floor(options.expires.getTime() / 1000));
  assert.equal(payload.expiresAt, options.expires.toISOString());
  assert.equal(payload.exp - payload.iat, 7 * 24 * 60 * 60);
  assert.equal(options.httpOnly, true);
});

test('expired sessions return null without logging token payloads', async () => {
  const count = logs.length;
  assert.equal(await session.decrypt(expiredToken), null);
  assert.equal(await session.decrypt(undefined), null);
  assert.equal(logs.length, count);
});

test('signed sessions without a usable access token are rejected', async () => {
  assert.equal(await session.decrypt(await session.encrypt({})), null);
  assert.equal(await session.decrypt(await session.encrypt({accessToken: 123})), null);
});

test('expired protected-page sessions redirect to localized login and clear the cookie', async () => {
  const response = await middleware(request('/zh-HK/profile/settings', expiredToken));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), 'https://app.example/zh-HK/auth/login?reason=session-expired');
  assert.equal(response.cookies.get('session').value, '');
  assert.equal(response.cookies.get('session').expires.getTime(), 0);
});

test('missing sessions redirect to login and valid sessions can access protected pages', async () => {
  const anonymous = await middleware(request('/zh-HK/profile'));
  assert.equal(anonymous.headers.get('location'), 'https://app.example/zh-HK/auth/login');
  const authenticated = await middleware(request('/zh-HK/profile', validToken));
  assert.equal(authenticated.headers.get('x-middleware-next'), '1');
});

test('server actions reach the action handler so it can send an action redirect', async () => {
  const response = await middleware(request('/zh-HK/profile', expiredToken, {
    method: 'POST', headers: {'next-action': 'test-action'},
  }));
  assert.equal(response.headers.get('location'), null);
  assert.equal(response.headers.get('x-middleware-next'), '1');
});

test('API-rejected tokens are cleared at login without redirecting back to the protected page', async () => {
  const response = await middleware(request('/zh-HK/auth/login?reason=session-expired', validToken));
  assert.equal(response.headers.get('location'), null);
  assert.equal(response.cookies.get('session').value, '');
  const ordinaryLogin = await middleware(request('/zh-HK/auth/login', validToken));
  assert.equal(ordinaryLogin.headers.get('location'), 'https://app.example/zh-HK');
});

test('expired cookies on public pages are cleared and locale redirects preserve the query', async () => {
  const response = await middleware(request('/zh-HK/news', expiredToken));
  assert.equal(response.cookies.get('session').value, '');
  const localized = await middleware(request('/auth/login?reason=session-expired'));
  assert.equal(localized.headers.get('location'), 'https://app.example/zh-HK/auth/login?reason=session-expired');
});

function makeFetcher(auth, fetchImpl, {isAction = false, deleteCookie = () => {}, logError = () => {}} = {}) {
  return loadSource('src/libs/fetcher.ts', {
    'next/navigation': {redirect},
    '@/libs/auth': {verifyAuth: async () => auth},
    'next-intl/server': {getLocale: async () => 'zh-HK'},
    'next/headers': {
      headers: async () => new Headers(isAction ? {'next-action': 'test-action'} : {}),
      cookies: async () => ({delete: deleteCookie}),
    },
  }, {fetch: fetchImpl, console: {error: logError}}).fetcher;
}

function assertLoginRedirect(error) {
  assert.equal(error.digest, 'NEXT_REDIRECT;replace;/zh-HK/auth/login?reason=session-expired;307;');
  // Client error handlers must let Next.js handle this instead of displaying an alert.
  assert.throws(() => unstable_rethrow(error), (rethrown) => rethrown === error);
  return true;
}

test('missing sessions redirect before making any API request', async () => {
  const fetcher = makeFetcher(null, () => assert.fail('Must not send Bearer undefined to the API'));
  await assert.rejects(fetcher('PUT', '/user/me', {}), assertLoginRedirect);
});

for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
  test(`${method} API 401 responses redirect to re-login`, async () => {
    const fetcher = makeFetcher({accessToken: 'test-access-token'}, async (_url, options) => {
      assert.equal(options.headers.Authorization, 'Bearer test-access-token');
      return new Response(null, {status: 401});
    });
    await assert.rejects(fetcher(method, '/app/example'), assertLoginRedirect);
  });
}

test('successful API requests and non-authentication errors retain their normal responses', async () => {
  for (const status of [200, 400, 403, 500]) {
    const response = new Response(null, {status});
    const fetcher = makeFetcher({accessToken: 'test-access-token'}, async () => response);
    assert.equal(await fetcher('GET', '/app/example'), response);
  }
});

test('server actions clear rejected session cookies before redirecting', async () => {
  const deletedCookies = [];
  const fetcher = makeFetcher({accessToken: 'test-access-token'}, async () => new Response(null, {status: 401}), {
    isAction: true, deleteCookie: (name) => deletedCookies.push(name),
  });
  await assert.rejects(fetcher('PUT', '/user/me'), assertLoginRedirect);
  assert.deepEqual(deletedCookies, ['session']);
});

test('server component redirects never try to modify read-only cookies', async () => {
  const fetcher = makeFetcher(null, () => assert.fail('Must not call the API'), {
    deleteCookie: () => assert.fail('Cannot mutate cookies during render'),
  });
  await assert.rejects(fetcher('GET', '/app/me'), assertLoginRedirect);
});

test('API errors identify the failed endpoint and status without logging credentials or response data', async () => {
  const errorLogs = [];
  const response = new Response(JSON.stringify({privateData: 'must-not-be-logged'}), {status: 404, statusText: 'Not Found'});
  const fetcher = makeFetcher({accessToken: 'must-not-be-logged'}, async () => response, {
    logError: (message) => errorLogs.push(message),
  });
  assert.equal(await fetcher('GET', '/app/enrollment/20596/swappable-lessons'), response);
  assert.deepEqual(errorLogs, ['API request failed: GET /app/enrollment/20596/swappable-lessons (404 Not Found)']);
  assert.deepEqual(await response.json(), {privateData: 'must-not-be-logged'});
});
