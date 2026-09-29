import {Link} from "@/i18n/navigation";
import {getTranslations} from "next-intl/server";
import {getCourses, getEnrolledCourses} from "@/libs/course";
import CourseCard from "@/components/course-card";
import BackButton from "@/components/back-button";
import {ChevronLeft} from "lucide-react";
import React from "react";
import CourseFilterButton from "@/components/course-filter-button";
import {getMe} from "@/libs/user";
import Card from "@/components/card";
import {Volleyball} from "lucide-react";
import {getCourseMonthKey, getNewEnrollmentBlockReason, getRenewalTargetMonth, isRenewalRestrictedToday, resolveRenewalNow} from "@/libs/course-renewal";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    area?: string;
    level?: string;
    age?: string;
    day?: string;
    category?: string;
    code?: string;
    debugDate?: string;
  }>;
}

export default async function CoursesPage(props: Props) {

  const { age, level, area, day, category, code, debugDate } = await props.searchParams;

  const t = await getTranslations();

  const [courses, enrolledCourses, me] = await Promise.all([
    getCourses({
      age: age || undefined,
      level: level || undefined,
      area: area || undefined,
      day: day || undefined,
      category: category || undefined,
      code: code || undefined,
    }),
    getEnrolledCourses(),
    getMe(),
  ]);

  const { now, isDebug: isDebugDate } = resolveRenewalNow(debugDate);
  const isRenewalPeriod = isRenewalRestrictedToday(now);
  const debugQuery = isDebugDate ? `?debugDate=${debugDate}` : '';
  const hasMonthlyCourses = courses.some(c => getCourseMonthKey(c.code) !== null);
  const isBlockedByEnrollmentWindow = (c: typeof courses[number]) => getNewEnrollmentBlockReason(c, now) !== null;

  const isEligible = (c: typeof courses[number]) => {
    const categories = [c.category?.order, c.category2?.order].filter(o => o !== undefined);
    const categoryOrder = Math.max(...categories);
    if (enrolledCourses.some(ec => ec.course.id === c.id)) {
      return false;
    }
    if (!me.category) {
      return false;
    }
    if (me.category.order >= 100) {
      return me.category.order >= categoryOrder && (categoryOrder >= 100 || categoryOrder < 10);
    }
    return categoryOrder <= me.category.order;
  };
  const canEnrollCourse = courses.filter(c => isEligible(c) && !isBlockedByEnrollmentWindow(c));
  const cannotEnrollCourse = courses.filter(c => {
    // Otherwise eligible, but not open for new enrollment today.
    if (isEligible(c) && isBlockedByEnrollmentWindow(c)) {
      return true;
    }
    if (!me.level) {
      return true;
    }
    if (enrolledCourses.some(ec => ec.course.id === c.id)) {
      return true;
    }
    if (!me.category || !c.category2) {
      return false;
    }
    if (me.category && me.category.order >= 100) {
      return !c.category2 || (c.category2.order > me.category.order || c.category2.order < 100);
    }
    return !c.category2 || (c.category2.order > me.category.order);
  }).sort((a, b) => {
    if (level) {
      return (b.category2?.order || 0) - (a.category2?.order || 0);
    }
    return 0;
  });

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <BackButton className="flex items-center gap-3">
          <div className="rounded-full border border-brand-neutral-300 w-[24px] h-[24px] flex items-center justify-center shadow cursor-pointer block">
            <ChevronLeft className="text-brand-neutral-900 size-5" strokeWidth={1.2} />
          </div>
          <h1 className="text-lg font-semibold">
            {!category ? t('Course.title') : category}
          </h1>
        </BackButton>

        <div className="flex items-center gap-4">
          {/*<div className="text-sm bg-primary-100 text-brand-neutral-900 py-1 px-2.5 rounded-full whitespace-pre">*/}
          {/*  {me.level}*/}
          {/*</div>*/}
          <CourseFilterButton initialValues={{ age, area, day, level, code }} />
        </div>
      </div>

      {isDebugDate ? (
        <div className="mt-2 text-xs font-mono text-amber-800 bg-amber-100 rounded-[12px] px-3 py-2">
          DEBUG debugDate={debugDate}
        </div>
      ) : null}
      {hasMonthlyCourses ? (
        <div className="mt-2 text-xs text-brand-neutral-500 bg-brand-neutral-100 rounded-[12px] px-3 py-2">
          {isRenewalPeriod ? (
            <>
              {t('Course.renewal-period-notice', { month: now.getMonth() + 1 })}
              {" "}
              <Link href="/" className="text-primary font-medium underline">{t('Course.go-to-renew')}</Link>
            </>
          ) : (
            <>
              {t('Course.next-month-only-notice', { month: getRenewalTargetMonth(now).month })}
              {" "}
              {t('Course.enrollment-schedule-notice')}
            </>
          )}
        </div>
      ) : null}

      <div className="mt-4 space-y-4">
        {courses.length === 0 ? (
          <Card className="h-[300px] flex flex-col justify-center items-center">
            <div className="w-[80px] h-[80px] bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Volleyball className="w-[40px] h-[40px] text-primary"/>
            </div>
            <p className="font-semibold text-xl text-brand-neutral-900">{t('Course.no-courses')}</p>
            <p className="text-sm text-brand-neutral-500 mt-2">{t('Course.no-courses-description')}</p>
          </Card>
        ) : (
          <>
            {canEnrollCourse.map((course) => (
              <Link key={course.id} href={`/class/courses/${course.id}${debugQuery}`} className="block">
                <CourseCard course={course} />
              </Link>
            ))}
            {cannotEnrollCourse.map((course) => (
              <Link key={course.id} href={`/class/courses/${course.id}${debugQuery}`} className="block opacity-50">
                <CourseCard course={course} />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
