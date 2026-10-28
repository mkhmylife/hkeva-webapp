import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import test from 'node:test';
import {loadSource} from './helpers/load-source.mjs';

const require = createRequire(import.meta.url);
const {notFound} = require('next/navigation');
const {renderToStaticMarkup} = require('react-dom/server');
const jsxRuntime = require('react/jsx-runtime');

function courseApi(fetcher) {
  return loadSource('src/libs/course.ts', {
    '@/libs/fetcher': {fetcher},
    '@/libs/course-renewal': {},
    'next/navigation': {notFound},
  });
}

const isNotFound = (error) => error.digest === 'NEXT_HTTP_ERROR_FALLBACK;404';

for (const [name, path] of [
  ['getEnrollment', '/app/enrollment/20596'],
  ['getEnrollmentSwappableLessons', '/app/enrollment/20596/swappable-lessons'],
]) {
  test(`${name} renders the not-found boundary for a missing record instead of a server error`, async () => {
    const api = courseApi(async (method, requestedPath) => {
      assert.equal(method, 'GET');
      assert.equal(requestedPath, path);
      return new Response(null, {status: 404, statusText: 'Not Found'});
    });
    await assert.rejects(api[name](20596), isNotFound);
  });

  test(`${name} preserves service errors instead of pretending there are no lessons`, async () => {
    const api = courseApi(async () => new Response(null, {status: 503, statusText: 'Service Unavailable'}));
    await assert.rejects(api[name](20596), {message: 'Service Unavailable'});
  });
}

test('a successful empty swappable-lessons response remains an empty list', async () => {
  const api = courseApi(async () => Response.json([]));
  assert.deepEqual(await api.getEnrollmentSwappableLessons(20596), []);
});

function substitutionPage(api) {
  return loadSource('src/app/[locale]/enrollment/[id]/substitution/page.tsx', {
    '@/libs/course': api,
    'next-intl/server': {getTranslations: async () => (key) => key},
    'next/navigation': {notFound},
    '@/components/back-button': {default: 'button'},
    'lucide-react': {ChevronLeft: 'span'},
    '@/components/lesson-card': {default: 'article'},
    '@/i18n/navigation': {Link: 'a'},
    react: {default: require('react')},
    'react/jsx-runtime': jsxRuntime,
  }).default;
}

test('invalid enrollment IDs show the not-found page before calling the API', async () => {
  const page = substitutionPage({getEnrollment: () => assert.fail('Must not request an invalid ID')});
  for (const id of ['invalid', '0', '-1', '1.5', '9007199254740992']) {
    await assert.rejects(page({params: Promise.resolve({locale: 'zh-HK', id})}), isNotFound);
  }
});

test('a valid enrollment without eligible lessons displays an empty-state message', async () => {
  const page = substitutionPage({
    getEnrollment: async (id) => {
      assert.equal(id, 20596);
      return {id, lesson: {course: {id: 12}}, course: {id: 12}};
    },
    getEnrollmentSwappableLessons: async () => [],
  });
  const element = await page({params: Promise.resolve({locale: 'zh-HK', id: '20596'})});
  const html = renderToStaticMarkup(element);
  assert.match(html, /role="status"/);
  assert.match(html, /EnrollmentSubstitutionApplication.no-lessons/);
});
