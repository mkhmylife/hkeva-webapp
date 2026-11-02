import assert from 'node:assert/strict';
import test from 'node:test';
import {loadSource} from './helpers/load-source.mjs';

const renewal = loadSource('src/libs/course-renewal.ts', {});
const date = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};
const course = (month, family = 'TK', id = 1) => ({
  id,
  code: `${family}${month}-U12-7-M2`,
});

test('booking target months follow the same two-month term throughout even and odd months', () => {
  const terms = [
    ['2026-01-01', ['26-01', '26-02']],
    ['2026-02-01', ['26-03', '26-04']],
    ['2026-03-01', ['26-03', '26-04']],
    ['2026-04-01', ['26-05', '26-06']],
    ['2026-05-01', ['26-05', '26-06']],
    ['2026-06-01', ['26-07', '26-08']],
    ['2026-07-01', ['26-07', '26-08']],
    ['2026-08-01', ['26-09', '26-10']],
    ['2026-09-01', ['26-09', '26-10']],
    ['2026-10-01', ['26-11', '26-12']],
    ['2026-11-01', ['26-11', '26-12']],
    ['2026-12-01', ['27-01', '27-02']],
    ['2027-01-01', ['27-01', '27-02']],
  ];
  for (const [today, expected] of terms) {
    const targets = renewal.getRenewalTargetMonths(date(today));
    assert.deepEqual(Array.from(targets, ({key}) => key), expected, today);
    assert.deepEqual(Array.from(targets, ({month}) => month), expected.map(key => Number(key.slice(-2))), today);
  }
});

test('only days 1–7 of even calendar months reserve booking for original-class renewals', () => {
  for (let month = 1; month <= 12; month++) {
    for (const day of [1, 7, 8, 28]) {
      const today = new Date(2026, month - 1, day);
      assert.equal(renewal.isRenewalRestrictedToday(today), month % 2 === 0 && day <= 7, `${month}/${day}`);
    }
  }
});

test('October 8 opens new enrollment for both November and December', () => {
  for (const month of ['26-11', '26-12']) {
    assert.equal(renewal.getNewEnrollmentBlockReason(course(month), date('2026-10-07')), 'renewal-period');
    assert.equal(renewal.getNewEnrollmentBlockReason(course(month), date('2026-10-08')), null);
    assert.equal(renewal.getNewEnrollmentBlockReason(course(month), date('2026-10-31')), null);
  }
});

test('November keeps November and December enrollment open, including November 1–7', () => {
  for (const today of ['2026-11-01', '2026-11-07', '2026-11-08', '2026-11-30']) {
    for (const month of ['26-11', '26-12']) {
      assert.equal(renewal.getNewEnrollmentBlockReason(course(month), date(today)), null, `${today}: ${month}`);
    }
  }
});

test('December 1–7 reserves the January/February term for renewals and December 8 opens it to all', () => {
  for (const month of ['27-01', '27-02']) {
    for (const today of ['2026-12-01', '2026-12-07']) {
      assert.equal(renewal.getNewEnrollmentBlockReason(course(month), date(today)), 'renewal-period', `${today}: ${month}`);
    }
    for (const today of ['2026-12-08', '2026-12-31', '2027-01-01', '2027-01-07', '2027-01-31']) {
      assert.equal(renewal.getNewEnrollmentBlockReason(course(month), date(today)), null, `${today}: ${month}`);
    }
  }
});

test('unrelated monthly courses outside the two-month term remain blocked', () => {
  const scenarios = [
    ['2026-10-08', ['26-09', '26-10', '27-01']],
    ['2026-11-07', ['26-10', '27-01', '27-02']],
    ['2026-12-08', ['26-11', '26-12', '27-03']],
    ['2027-01-07', ['26-12', '27-03']],
    ['2027-02-08', ['27-01', '27-02', '27-05']],
  ];
  for (const [today, months] of scenarios) {
    for (const month of months) {
      const candidate = course(month, 'OTHER');
      assert.equal(renewal.getNewEnrollmentBlockReason(candidate, date(today)), 'outside-enrollment-period', `${today}: ${month}`);
      assert.equal(renewal.getRenewalWindowBlockReason(candidate, [], date(today)), 'outside-enrollment-period', `${today}: ${month}`);
    }
  }
});

test('nonmonthly new enrollment is unaffected by the monthly booking calendar', () => {
  const nonmonthly = {id: 1, code: 'SUMMER-CAMP'};
  for (const today of ['2026-10-01', '2026-11-01', '2026-12-07']) {
    assert.equal(renewal.getNewEnrollmentBlockReason(nonmonthly, date(today)), null);
  }
});

test('original-class renewals remain available during priority days, including future related courses', () => {
  const applied = [{course: course('26-11')}];
  for (const today of ['2026-12-01', '2026-12-07']) {
    for (const month of ['27-01', '27-02', '27-03']) {
      assert.equal(renewal.getRenewalWindowBlockReason(course(month), applied, date(today)), null, `${today}: ${month}`);
      assert.equal(renewal.canRenewToCourseThisMonth(course(month), applied, date(today)), true);
    }
    for (const month of ['27-01', '27-02']) {
      assert.equal(renewal.getRenewalWindowBlockReason(course(month, 'OTHER'), applied, date(today)), 'not-related');
      assert.equal(renewal.canRenewToCourseThisMonth(course(month, 'OTHER'), applied, date(today)), false);
    }
    assert.equal(renewal.getRenewalWindowBlockReason(course('26-11'), applied, date(today)), 'outside-enrollment-period');
    assert.equal(renewal.getRenewalWindowBlockReason(course('26-12'), applied, date(today)), 'outside-enrollment-period');
  }
});

test('unrelated renewal candidates in both target months open on the 8th and throughout odd months', () => {
  for (const [today, months] of [
    ['2026-10-08', ['26-11', '26-12']],
    ['2026-11-01', ['26-11', '26-12']],
    ['2026-11-07', ['26-11', '26-12']],
    ['2026-12-08', ['27-01', '27-02']],
    ['2027-01-01', ['27-01', '27-02']],
  ]) {
    for (const month of months) {
      assert.equal(renewal.getRenewalWindowBlockReason(course(month, 'OTHER'), [], date(today)), null, `${today}: ${month}`);
    }
  }
});

test('renewing to a course in the source course month stays blocked', () => {
  const from = course('26-11');
  const candidate = course('26-11', 'OTHER', 2);
  for (const today of ['2026-11-07', '2026-11-30']) {
    assert.equal(renewal.getRenewalWindowBlockReason(candidate, [{course: from}], date(today)), null);
    assert.equal(renewal.getRenewalBlockReason(candidate, from, [{course: from}], date(today)), 'same-month');
  }
});

function courseApi({candidate, from = course('26-11', 'TK', 2), applied = [{course: from}]}) {
  const posts = [];
  const api = loadSource('src/libs/course.ts', {
    '@/libs/course-renewal': renewal,
    '@/libs/fetcher': {
      fetcher: async (method, path, payload) => {
        if (method === 'POST') {
          assert.equal(path, `/app/course/${candidate.id}/enroll`);
          posts.push(payload);
          return Response.json({id: 100});
        }
        assert.equal(method, 'GET');
        if (path === `/app/course/${candidate.id}`) return Response.json(candidate);
        if (path === `/app/course/${from.id}`) return Response.json(from);
        if (path === '/app/enrollment/course') return Response.json(applied);
        assert.fail(`Unexpected course API request: ${method} ${path}`);
      },
    },
    'next/navigation': {notFound: () => assert.fail('Unexpected not-found response')},
  });
  return {api, posts};
}

test('enrollment server action blocks priority-period and out-of-term new bookings before posting', async () => {
  for (const [today, month, expected] of [
    ['2026-12-01', '27-01', 'renewal-period'],
    ['2026-12-07', '27-02', 'renewal-period'],
    ['2026-10-08', '27-01', 'outside-enrollment-period'],
  ]) {
    const {api, posts} = courseApi({candidate: course(month)});
    const result = await api.enrollCourse(1, [], false, {debugDate: today});
    assert.equal(result.blockedReason, expected, `${today}: ${month}`);
    assert.equal(posts.length, 0);
  }
});

test('enrollment server action permits second-term-month bookings on opening day and in odd months', async () => {
  for (const [today, month] of [
    ['2026-10-08', '26-12'],
    ['2026-11-01', '26-11'],
    ['2026-11-07', '26-12'],
    ['2026-11-30', '26-11'],
    ['2026-11-30', '26-12'],
    ['2026-12-08', '27-02'],
    ['2027-01-01', '27-02'],
  ]) {
    const {api, posts} = courseApi({candidate: course(month)});
    const result = await api.enrollCourse(1, [], false, {debugDate: today});
    assert.equal(result.invoice.id, 100, `${today}: ${month}`);
    assert.equal(posts.length, 1);
    assert.equal(posts[0].isRenewal, false);
  }
});

test('renewal server action enforces original-class priority and opens unrelated February courses on December 8', async () => {
  for (const [today, family, expected] of [
    ['2026-12-07', 'OTHER', 'not-related'],
    ['2026-12-07', 'TK', null],
    ['2026-12-08', 'OTHER', null],
  ]) {
    const {api, posts} = courseApi({candidate: course('27-02', family)});
    const result = await api.enrollCourse(1, [], true, {fromCourseId: 2, debugDate: today});
    assert.equal(result.blockedReason ?? null, expected, `${today}: ${family}`);
    assert.equal(posts.length, expected === null ? 1 : 0);
    if (expected === null) {
      assert.equal(result.invoice.id, 100);
      assert.equal(posts[0].isRenewal, true);
    }
  }
});
