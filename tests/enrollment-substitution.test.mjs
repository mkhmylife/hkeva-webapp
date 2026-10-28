import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import test from 'node:test';
import {loadSource} from './helpers/load-source.mjs';

const require = createRequire(import.meta.url);
const {notFound} = require('next/navigation');
const {renderToStaticMarkup} = require('react-dom/server');
const jsxRuntime = require('react/jsx-runtime');
const enrollmentTypes = loadSource('src/types/enrollment.ts', {});
const substitutionEligibility = loadSource('src/libs/enrollment-substitution.ts', {
  '@/types/enrollment': enrollmentTypes,
});

const enrollmentFixture = {
  id: 20596,
  status: 'Holiday',
  swapApproveStatus: 'Approved',
  hasSwapped: false,
  expiredAt: '2099-01-01T00:00:00.000Z',
  lesson: {course: {id: 12}, date: '2026-06-07', startTime: '10:00', endTime: '11:00'},
  course: {id: 12},
  enrollmentCounts: 1,
  enrollmentIndex: 1,
};

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
    '@/libs/enrollment-substitution': substitutionEligibility,
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
      return {...enrollmentFixture, id};
    },
    getEnrollmentSwappableLessons: async () => [],
  });
  const element = await page({params: Promise.resolve({locale: 'zh-HK', id: '20596'})});
  const html = renderToStaticMarkup(element);
  assert.match(html, /role="status"/);
  assert.match(html, /EnrollmentSubstitutionApplication.no-lessons/);
});

const ineligibleEnrollments = [
  // The supplied database record: transferred to an invoice without a swapToId.
  {...enrollmentFixture, status: 'InvoiceSwapped', expiredAt: '2026-09-01T07:59:59.999Z'},
  {...enrollmentFixture, status: 'InvoiceSwappedAsPoint'},
  {...enrollmentFixture, status: 'Cancelled'},
  {...enrollmentFixture, status: 'Rescheduled'},
  {...enrollmentFixture, swapApproveStatus: 'Pending'},
  {...enrollmentFixture, swapApproveStatus: 'Rejected'},
  {...enrollmentFixture, hasSwapped: true},
];

test('only approved, unused enrollments with eligible statuses can apply for substitution', () => {
  for (const status of Object.values(enrollmentTypes.LessonEnrollmentStatus)) {
    assert.equal(
      substitutionEligibility.canApplyEnrollmentSubstitution({...enrollmentFixture, status}),
      ['Enrolled', 'Holiday'].includes(status),
      status,
    );
  }
  for (const enrollment of ineligibleEnrollments) {
    assert.equal(substitutionEligibility.canApplyEnrollmentSubstitution(enrollment), false);
  }
});

test('direct substitution URLs reject ineligible records before requesting swappable lessons', async () => {
  for (const enrollment of ineligibleEnrollments) {
    const page = substitutionPage({
      getEnrollment: async () => enrollment,
      getEnrollmentSwappableLessons: () => assert.fail('Must not request lessons for an ineligible enrollment'),
    });
    await assert.rejects(page({params: Promise.resolve({locale: 'zh-HK', id: '20596'})}), isNotFound);
  }
});

function cardImports(enrollment) {
  return {
    '@/components/card': {default: 'section'},
    '@/components/back-button': {default: 'button'},
    '@/components/enrollment-card-menu': {default: 'span'},
    'next-intl/server': {getTranslations: async () => (key) => key},
    '@/libs/weekday': {convertWeekdayToNumber: () => '一'},
    'moment/moment': {default: require('moment')},
    '@/i18n/navigation': {Link: 'a'},
    '@/types/enrollment': enrollmentTypes,
    '@/libs/course': {getEnrollment: async () => enrollment},
    '@/libs/enrollment-substitution': substitutionEligibility,
    'react/jsx-runtime': jsxRuntime,
  };
}

test('history cards hide invalid substitution links and identify used invoice credits', async () => {
  for (const enrollment of [enrollmentFixture, ...ineligibleEnrollments]) {
    const Card = loadSource('src/components/enrollment-holiday-status-card.tsx', cardImports(enrollment)).default;
    const html = renderToStaticMarkup(await Card({enrollment}));
    assert.equal(html.includes('href="/enrollment/20596/substitution"'), enrollment === enrollmentFixture);
    if (['InvoiceSwapped', 'InvoiceSwappedAsPoint'].includes(enrollment.status)) {
      assert.match(html, /Lesson.credit-used/);
    }
  }
});

test('timetable cards do not offer substitution for rejected, used or transferred enrollments', async () => {
  for (const enrollment of [enrollmentFixture, ...ineligibleEnrollments]) {
    const Card = loadSource('src/components/enrollment-card.tsx', cardImports(enrollment)).default;
    const html = renderToStaticMarkup(await Card({enrollment, buttonType: 'status'}));
    assert.equal(html.includes('href="/enrollment/20596/substitution"'), enrollment === enrollmentFixture);
  }
});

test('direct confirmation URLs reject transferred enrollments before fetching the target lesson', async () => {
  const Page = loadSource('src/app/[locale]/enrollment/[id]/substitution/[swapToLessonId]/page.tsx', {
    '@/libs/course': {
      getEnrollment: async () => ineligibleEnrollments[0],
      getLesson: () => assert.fail('Must not load a target lesson for a transferred enrollment'),
    },
    '@/libs/enrollment-substitution': substitutionEligibility,
    'next/navigation': {notFound},
    'next-intl/server': {getTranslations: async () => (key) => key},
    '@/components/enrollment-card': {default: 'section'},
    '@/components/enrollment-substitution-application': {default: 'button'},
    '@/components/back-button': {default: 'button'},
    'lucide-react': {ArrowDown: 'span', ChevronLeft: 'span'},
    react: {default: require('react')},
    'react/jsx-runtime': jsxRuntime,
  }).default;
  await assert.rejects(Page({params: Promise.resolve({id: 20596, swapToLessonId: 2255})}), isNotFound);
});

test('revisiting leave-success does not offer substitution for a transferred enrollment', async () => {
  for (const enrollment of [enrollmentFixture, ineligibleEnrollments[0]]) {
    const Page = loadSource('src/app/[locale]/enrollment/[id]/leave/success/page.tsx', {
      '@/libs/course': {getEnrollment: async () => enrollment},
      '@/libs/enrollment-substitution': substitutionEligibility,
      'next-intl/server': {getTranslations: async () => (key) => key},
      '@/components/enrollment-card': {default: 'section'},
      'lucide-react': {Check: 'span'},
      '@/i18n/navigation': {Link: 'a'},
      'react/jsx-runtime': jsxRuntime,
    }).default;
    const html = renderToStaticMarkup(await Page({params: Promise.resolve({id: 20596})}));
    assert.equal(html.includes('href="/enrollment/20596/substitution"'), enrollment === enrollmentFixture);
  }
});
