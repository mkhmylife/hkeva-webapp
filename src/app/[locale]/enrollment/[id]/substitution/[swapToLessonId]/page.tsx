import {getEnrollment, getLesson} from "@/libs/course";
import {getTranslations} from "next-intl/server";
import EnrollmentCard from "@/components/enrollment-card";
import {ArrowDown, ChevronLeft} from "lucide-react";
import BackButton from "@/components/back-button";
import React from "react";
import EnrollmentSubstitutionApplication from "@/components/enrollment-substitution-application";

type Props = {
  params: Promise<{
    locale: string;
    id: number;
    swapToLessonId: number;
  }>;
}

export default async function EnrollmentSubstitutionSwapToPage(props: Props) {

  const { id, swapToLessonId } = await props.params;

  const enrollment = await getEnrollment(id);
  const swapToLesson = await getLesson(swapToLessonId);

  const t = await getTranslations();

  return (
    <>
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <BackButton className="flex items-center gap-3">
            <div
              className="rounded-full border border-brand-neutral-300 w-[24px] h-[24px] flex items-center justify-center shadow cursor-pointer block">
              <ChevronLeft className="text-brand-neutral-900 size-5" strokeWidth={1.2}/>
            </div>
            <h1 className="text-lg font-semibold">{t('EnrollmentSubstitutionApplication.select-lesson')}</h1>
          </BackButton>
          <div className="flex items-center gap-4">
            <p
              className="text-sm">{t('Enrollment.applied-substitution-x-time', {x: 0})}</p>
            <div className="text-sm bg-primary-100 text-brand-neutral-900 py-1 px-2.5 rounded-full whitespace-pre">
              {enrollment.lesson.course?.category2?.name}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="-mb-[40px]">
            <EnrollmentCard
              enrollment={enrollment}
              isSwap={true}
            />
          </div>
          <div className="flex justify-center items-center">
            <div className="size-[97px] shadow-md bg-primary-900 text-white rounded-full flex justify-center items-center">
              <ArrowDown className="size-[65px]"/>
            </div>
          </div>
          <div className="-mt-[35px]">
            <EnrollmentSubstitutionApplication
              enrollment={enrollment}
              swapToLesson={swapToLesson}
            />
          </div>
        </div>
      </div>
    </>
  )
}