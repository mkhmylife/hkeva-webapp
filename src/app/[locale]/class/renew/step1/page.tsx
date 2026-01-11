import {getCourse, getCourses} from "@/libs/course";
import {getTranslations} from "next-intl/server";
import BackButton from "@/components/back-button";
import {ChevronLeft} from "lucide-react";
import React from "react";
import {Link} from "@/i18n/navigation";
import {getMe} from "@/libs/user";
import CourseCard from "@/components/course-card";
import CourseFilterButton from "@/components/course-filter-button";

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
  }>;
}

export default async function CourseRenewPage(props: Props) {

  const { fromCourseId, age, level, area, day } = await props.searchParams;

  const t = await getTranslations();

  const me = await getMe();
  const currentCourse = await getCourse(Number(fromCourseId));
  const courses = await getCourses({
    age: age || undefined,
    level: level || undefined,
    area: area || undefined,
    day: day || undefined,
  });
  const canEnrollCourse = courses.filter(c => {
    if (!me.category || !c.category2) {
      return false;
    }
    if (me.category.order >= 100) {
      return c.category2 && c.category2.order <= me.category.order && c.category2.order >= 100;
    }
    return c.category2 && c.category2.order <= me.category.order;
  });
  const cannotEnrollCourse = courses.filter(c => {
    if (!me.category || !c.category2) {
      return false;
    }
    if (me.category && me.category.order >= 100) {
      return !c.category2 || (c.category2.order > me.category.order || c.category2.order < 100);
    }
    return !c.category2 || (c.category2.order > me.category.order);
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
      <div className="space-y-3 my-3">
        {canEnrollCourse.filter(c => c.id.toString() !== fromCourseId).map(course => (
          <Link key={course.id} href={`/class/renew/step2?fromCourseId=${fromCourseId}&toCourseId=${course.id}`} className="block">
            <CourseCard course={course} />
          </Link>
        ))}
        {cannotEnrollCourse.filter(c => c.id.toString() !== fromCourseId).map(course => (
          <Link key={course.id} href={`/class/renew/step2?fromCourseId=${fromCourseId}&toCourseId=${course.id}`} className="block opacity-50">
            <CourseCard course={course} />
          </Link>
        ))}
      </div>
    </div>
  );
}
