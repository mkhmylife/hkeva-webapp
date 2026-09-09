import {CourseDto} from "@/types/courseDto";

// During each month's first 7 days, renewal is restricted to courses related
// to one the user has already applied for (see isRenewalRestrictedToday /
// canRenewToCourseThisMonth below). From the 8th day onward any course can
// be picked.
const RESTRICTED_WINDOW_DAYS = 7;

/**
 * Course codes follow the pattern `<prefix><year>-<month>-<rest...>`,
 * e.g. "TK26-09-U12-7-M2". Two codes are "related" (the same course offered
 * in a different month) when every segment except the month matches, e.g.
 * "TK26-09-U12-7-M2" and "TK26-07-U12-7-M2".
 */
export const getCourseFamilyKey = (code: string): string => {
  const segments = code.split('-');
  if (segments.length < 2) {
    return code;
  }
  const [prefix, , ...rest] = segments;
  return [prefix, ...rest].join('-');
};

export const isRelatedCourseCode = (codeA?: string, codeB?: string): boolean => {
  if (!codeA || !codeB) {
    return false;
  }
  return getCourseFamilyKey(codeA) === getCourseFamilyKey(codeB);
};

/**
 * True on the 1st through 7th of the month (inclusive), when renewal is
 * restricted to related courses. False from the 8th day onward.
 */
export const isRenewalRestrictedToday = (now: Date = new Date()): boolean => {
  return now.getDate() <= RESTRICTED_WINDOW_DAYS;
};

/**
 * Whether `candidate` can be renewed into today, given the courses the user
 * has already applied for. Outside the restricted window this is always
 * true; inside it, `candidate` must be related (by code) to at least one
 * applied course.
 */
export const canRenewToCourseThisMonth = (
  candidate: CourseDto,
  appliedCourses: { course: CourseDto }[],
  now: Date = new Date(),
): boolean => {
  if (!isRenewalRestrictedToday(now)) {
    return true;
  }
  return appliedCourses.some(ac => isRelatedCourseCode(ac.course.code, candidate.code));
};
