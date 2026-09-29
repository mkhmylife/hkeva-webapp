import {getCourse, getCourses, getEnrolledCourses} from "@/libs/course";
import {getTranslations} from "next-intl/server";
import BackButton from "@/components/back-button";
import {ChevronLeft} from "lucide-react";
import React from "react";
import {Link} from "@/i18n/navigation";
import {getMe} from "@/libs/user";
import CourseCard from "@/components/course-card";
import CourseFilterButton from "@/components/course-filter-button";
import {canRenewToCourseThisMonth, getRenewalTargetMonth, isRenewalRestrictedToday, isSameMonthAsCourse, resolveRenewalNow, sortRenewalCandidates} from "@/libs/course-renewal";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    fromCourseId: string;
    area?: string;
    level?: string;
    age?: string;
    day?: string;
    debugDate?: string;
  }>;
}

export default async function CourseRenewPage(props: Props) {

  const { fromCourseId, age, level, area, day, debugDate } = await props.searchParams;

  const t = await getTranslations();

  const [currentCourse, enrolledCourses, courses, me] = await Promise.all([
    getCourse(Number(fromCourseId)),
    getEnrolledCourses(),
    getCourses({
      age: age || undefined,
      level: level || undefined,
      area: area || undefined,
      day: day || undefined,
    }),
    getMe(),
  ]);

  const { now, isDebug: isDebugDate } = resolveRenewalNow(debugDate);
  const isRestricted = isRenewalRestrictedToday(now);
  const targetMonth = getRenewalTargetMonth(now).month;
  const debugQuery = isDebugDate ? `&debugDate=${debugDate}` : '';

  const isCategoryEligible = (c: typeof courses[number]) => {
    if (!me.category || !c.category2) {
      return false;
    }
    if (me.category.order >= 100) {
      return !!(c.category2 && c.category2.order <= me.category.order && c.category2.order >= 100);
    }
    return !!(c.category2 && c.category2.order <= me.category.order);
  };

  const sortedCourses = sortRenewalCandidates(courses, currentCourse);

  const canEnrollCourse = sortedCourses.filter(c => {
    if (enrolledCourses.some(ec => ec.course.id === c.id)) {
      return false;
    }
    if (!isCategoryEligible(c)) {
      return false;
    }
    if (isSameMonthAsCourse(c, currentCourse)) {
      return false;
    }
    if (!canRenewToCourseThisMonth(c, enrolledCourses, now)) {
      return false;
    }
    return true;
  });
  const cannotEnrollCourse = sortedCourses.filter(c => {
    if (enrolledCourses.some(ec => ec.course.id === c.id)) {
      return true;
    }
    if (!isCategoryEligible(c)) {
      return false;
    }
    // Category-eligible, but in the same month as the current course.
    if (isSameMonthAsCourse(c, currentCourse)) {
      return true;
    }
    // Category-eligible, but not held next month, or blocked by the
    // first-7-days related-course rule.
    return !canRenewToCourseThisMonth(c, enrolledCourses, now);
  });

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <BackButton className="flex items-center gap-3">
          <div className="rounded-full border border-brand-neutral-300 w-[24px] h-[24px] flex items-center justify-center shadow cursor-pointer block">
            <ChevronLeft className="text-brand-neutral-900 size-5" strokeWidth={1.2} />
          </div>
          <h1 className="text-lg font-semibold">{t('CourseRenew.title')}</h1>
        </BackButton>

        <div className="flex items-center gap-4">
          <div className="text-sm bg-primary-100 text-brand-neutral-900 py-1 px-2.5 rounded-full whitespace-pre">
            {me.level}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="mt-4 font-semibold text-lg">{t('CourseRenew.current-course')}</h2>
        <CourseFilterButton initialValues={{ age, area, day, level }} />
      </div>
      <div className="space-y-3 my-3">
        <CourseCard course={currentCourse} />
      </div>

      <h2 className="mt-4 font-semibold text-lg">{t('CourseRenew.select-course')}</h2>
      {isDebugDate ? (
        <div className="mt-2 text-xs font-mono text-amber-800 bg-amber-100 rounded-[12px] px-3 py-2">
          DEBUG debugDate={debugDate}
        </div>
      ) : null}
      <div className="mt-2 text-xs text-brand-neutral-500 bg-brand-neutral-100 rounded-[12px] px-3 py-2">
        {isRestricted
          ? t('CourseRenew.related-course-only-notice', { month: targetMonth })
          : t('CourseRenew.next-month-only-notice', { month: targetMonth })}
      </div>
      <div className="space-y-3 my-3">
        {canEnrollCourse.filter(c => c.id.toString() !== fromCourseId).map(course => (
          <Link key={course.id} href={`/class/renew/step2?fromCourseId=${fromCourseId}&toCourseId=${course.id}${debugQuery}`} className="block">
            <CourseCard course={course} />
          </Link>
        ))}
        {cannotEnrollCourse.filter(c => c.id.toString() !== fromCourseId).map(course => (
          <Link key={course.id} href={`/class/renew/step2?fromCourseId=${fromCourseId}&toCourseId=${course.id}${debugQuery}`} className="block opacity-50">
            <CourseCard course={course} />
          </Link>
        ))}
      </div>
    </div>
  );
}
