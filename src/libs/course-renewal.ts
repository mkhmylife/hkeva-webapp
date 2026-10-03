import {CourseDto} from "@/types/courseDto";

// In month X, renewal is open for courses in the same family as one the user
// has already applied for, held in any month after X. Other courses must be
// held in month X+1, and only from the 8th day of month X onward (see
// isRenewalRestrictedToday / getRenewalWindowBlockReason below).
const RESTRICTED_WINDOW_DAYS = 7;

/**
 * Course codes follow the pattern `<prefix><year>-<month>-<rest...>`,
 * e.g. "TK26-09-U12-7-M2". Two codes are "related" (the same course offered
 * in a different month) when every segment except the year and month
 * matches, e.g. "TK26-09-U12-7-M2" and "TK26-07-U12-7-M2", or
 * "TK26-12-U12-7-M2" and "TK27-01-U12-7-M2".
 */
export const getCourseFamilyKey = (code: string): string => {
  const segments = code.split('-');
  if (segments.length < 2) {
    return code;
  }
  const [, , ...rest] = segments;
  return [getCoursePrefix(code), ...rest].join('-');
};

export const isRelatedCourseCode = (codeA?: string, codeB?: string): boolean => {
  if (!codeA || !codeB) {
    return false;
  }
  return getCourseFamilyKey(codeA) === getCourseFamilyKey(codeB);
};

/**
 * Whether the `debugDate` search param may override today's date on the
 * renewal pages. Always allowed outside production; in production only when
 * RENEWAL_DEBUG_DATE=true, so real users cannot bypass the renewal window.
 */
export const isRenewalDebugDateEnabled = (): boolean => {
  return process.env.NODE_ENV !== 'production' || process.env.RENEWAL_DEBUG_DATE === 'true';
};

/**
 * The date the renewal rules are evaluated against: `debugDate`
 * (YYYY-MM-DD, local midnight) when debugging is enabled and the value is
 * valid, otherwise now.
 */
export const resolveRenewalNow = (debugDate?: string): { now: Date; isDebug: boolean } => {
  const match = debugDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match && isRenewalDebugDateEnabled()) {
    const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
    const now = new Date(year, month - 1, day);
    // Reject values like 2026-13-40 that Date would silently roll over.
    if (now.getFullYear() === year && now.getMonth() === month - 1 && now.getDate() === day) {
      return { now, isDebug: true };
    }
  }
  return { now: new Date(), isDebug: false };
};

/**
 * True on the 1st through 7th of the month (inclusive), when renewal is
 * restricted to related courses. False from the 8th day onward.
 */
export const isRenewalRestrictedToday = (now: Date = new Date()): boolean => {
  return now.getDate() <= RESTRICTED_WINDOW_DAYS;
};

/**
 * The month renewals are open for today (the month after `now`), as a
 * year-month key comparable with getCourseMonthKey, e.g. 2026-09-29 -> "26-10".
 */
const toMonthKey = (date: Date): string => {
  const yy = String(date.getFullYear() % 100).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${yy}-${mm}`;
};

export const getRenewalTargetMonth = (now: Date = new Date()): { key: string; month: number } => {
  const target = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { key: toMonthKey(target), month: target.getMonth() + 1 };
};

export type RenewalWindowBlockReason = 'not-next-month' | 'not-related';

/**
 * Why `candidate` cannot be renewed into today, or null when it can:
 * - A course in the same family as one the user has applied for can be
 *   picked on any day, as long as it is held after the current month.
 * - 'not-next-month': any other course must be held in the month after the
 *   current one.
 * - 'not-related': within the first 7 days, only same-family courses can be
 *   picked.
 */
export const getRenewalWindowBlockReason = (
  candidate: CourseDto,
  appliedCourses: { course: CourseDto }[],
  now: Date = new Date(),
): RenewalWindowBlockReason | null => {
  const candidateMonth = getCourseMonthKey(candidate.code);
  const isRelated = appliedCourses.some(ac => isRelatedCourseCode(ac.course.code, candidate.code));
  // Month keys are "YY-MM", so string comparison orders them chronologically.
  if (isRelated && candidateMonth !== null && candidateMonth > toMonthKey(now)) {
    return null;
  }
  if (candidateMonth !== getRenewalTargetMonth(now).key) {
    return 'not-next-month';
  }
  if (isRenewalRestrictedToday(now) && !isRelated) {
    return 'not-related';
  }
  return null;
};

export const canRenewToCourseThisMonth = (
  candidate: CourseDto,
  appliedCourses: { course: CourseDto }[],
  now: Date = new Date(),
): boolean => {
  return getRenewalWindowBlockReason(candidate, appliedCourses, now) === null;
};

export type NewEnrollmentBlockReason = 'not-next-month' | 'renewal-period';

/**
 * Why `candidate` cannot be newly enrolled into today (outside the renewal
 * flow), or null when it can. We don't know which course the user is
 * renewing from here, so the first 7 days of month X are reserved for
 * renewals and new enrollment into month X+1 courses opens on the 8th.
 * Courses whose code has no month (not monthly courses) are not affected.
 */
export const getNewEnrollmentBlockReason = (
  candidate: CourseDto,
  now: Date = new Date(),
): NewEnrollmentBlockReason | null => {
  const candidateMonth = getCourseMonthKey(candidate.code);
  if (candidateMonth === null) {
    return null;
  }
  if (candidateMonth !== getRenewalTargetMonth(now).key) {
    return 'not-next-month';
  }
  if (isRenewalRestrictedToday(now)) {
    return 'renewal-period';
  }
  return null;
};

/**
 * The year-month a course runs in, taken from its code, e.g.
 * "TK26-09-U12-7-M2" -> "26-09". Returns null when the code does not follow
 * the `<prefix><year>-<month>-<rest...>` pattern.
 */
export const getCourseMonthKey = (code?: string): string | null => {
  const match = code?.match(/^[^-]*?(\d{2})-(\d{2})(?:-|$)/);
  if (!match) {
    return null;
  }
  return `${match[1]}-${match[2]}`;
};

/**
 * Renewing moves the user to a different month, so a course that runs in the
 * same month as the one being renewed from cannot be applied for.
 */
export const isSameMonthAsCourse = (candidate: CourseDto, fromCourse: CourseDto): boolean => {
  const candidateMonth = getCourseMonthKey(candidate.code);
  return candidateMonth !== null && candidateMonth === getCourseMonthKey(fromCourse.code);
};

/**
 * The prefix of a course code, before the year, e.g.
 * "TK26-09-U12-7-M2" -> "TK".
 */
export const getCoursePrefix = (code?: string): string => {
  const [first = ''] = (code ?? '').split('-');
  return first.replace(/\d+$/, '');
};

/**
 * Orders renewal candidates relative to the course being renewed from:
 * courses with the same code prefix first, then those at the same level.
 * Otherwise keeps the original order.
 */
export const sortRenewalCandidates = <T extends CourseDto>(courses: T[], fromCourse: CourseDto): T[] => {
  const fromPrefix = getCoursePrefix(fromCourse.code);
  const rank = (c: CourseDto) =>
    (getCoursePrefix(c.code) === fromPrefix ? 0 : 2) +
    (c.category?.id !== undefined && c.category.id === fromCourse.category?.id ? 0 : 1);
  return [...courses].sort((a, b) => rank(a) - rank(b));
};

export type RenewalBlockReason = 'same-month' | RenewalWindowBlockReason;

/**
 * Every renewal rule for renewing from `fromCourse` into `candidate`:
 * the same-month rule plus the renewal window.
 */
export const getRenewalBlockReason = (
  candidate: CourseDto,
  fromCourse: CourseDto,
  appliedCourses: { course: CourseDto }[],
  now: Date = new Date(),
): RenewalBlockReason | null => {
  if (isSameMonthAsCourse(candidate, fromCourse)) {
    return 'same-month';
  }
  return getRenewalWindowBlockReason(candidate, appliedCourses, now);
};

export type EnrollmentBlockReason = RenewalBlockReason | NewEnrollmentBlockReason | 'missing-from-course';
