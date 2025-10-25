import {getEnrollment, getEnrollmentSwappableLessons} from "@/libs/course";
import {getTranslations} from "next-intl/server";
import BackButton from "@/components/back-button";
import {ChevronLeft} from "lucide-react";
import React from "react";
import LessonCard from "@/components/lesson-card";
import {Link} from "@/i18n/navigation";

type Props = {
  params: Promise<{
    locale: string;
    id: number;
  }>;
}

export default async function EnrollmentSubstitutionPage(props: Props) {

  const { id } = await props.params;

  const enrollment = await getEnrollment(id);

  const lessons = await getEnrollmentSwappableLessons(enrollment.id);

  const t = await getTranslations();

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <BackButton className="flex items-center gap-3">
          <div className="rounded-full border border-brand-neutral-300 w-[24px] h-[24px] flex items-center justify-center shadow cursor-pointer block">
            <ChevronLeft className="text-brand-neutral-900 size-5" strokeWidth={1.2} />
          </div>
          <h1 className="text-lg font-semibold">{t('EnrollmentSubstitutionApplication.title')}</h1>
        </BackButton>
        <div className="flex items-center gap-4">
          <p
            className="text-sm">{t('Enrollment.applied-substitution-x-time', {x: 0})}</p>
          <div className="text-sm bg-primary-100 text-brand-neutral-900 py-1 px-2.5 rounded-full whitespace-pre">
            {enrollment.lesson.course?.category2?.name}
          </div>
        </div>
      </div>

      <h2 className="mt-4 font-semibold text-lg">{t('EnrollmentSubstitutionApplication.select-lesson')}</h2>
      <div className="space-y-3 my-3">
        {lessons.map(lesson => (
          <Link key={lesson.id} href={`/enrollment/${enrollment.id}/substitution/${lesson.id}`} className="block">
            <LessonCard lesson={lesson} />
          </Link>
        ))}
      </div>
    </div>
  );
}
