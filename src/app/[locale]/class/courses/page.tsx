import {Link} from "@/i18n/navigation";
import {getTranslations} from "next-intl/server";
import {getCourses} from "@/libs/course";
import CourseCard from "@/components/course-card";
import BackButton from "@/components/back-button";
import {ChevronLeft} from "lucide-react";
import React from "react";
import CourseFilterButton from "@/components/course-filter-button";
import {getMe} from "@/libs/user";
import Card from "@/components/card";
import {Volleyball} from "lucide-react";

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
  }>;
}

export default async function CoursesPage(props: Props) {

  const { age, level, area, day, category, code } = await props.searchParams;

  const t = await getTranslations();

  const [courses, me] = await Promise.all([
    getCourses({
      age: age || undefined,
      level: level || undefined,
      area: area || undefined,
      day: day || undefined,
      category: category || undefined,
      code: code || undefined,
    }),
    getMe(),
  ]);

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
              <Link key={course.id} href={`/class/courses/${course.id}`} className="block">
                <CourseCard course={course} />
              </Link>
            ))}
            {cannotEnrollCourse.map((course) => (
              <Link key={course.id} href={`/class/courses/${course.id}`} className="block opacity-50">
                <CourseCard course={course} />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
