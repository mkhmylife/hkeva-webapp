'use client';

import LessonCardLarge from "@/components/lesson-card-large";
import React, {useCallback, useState} from "react";
import {LessonDto} from "@/types/lessonDto";
import {useTranslations} from "next-intl";
import {EnrollmentDto} from "@/types/enrollment";
import {applyEnrollmentSubstitution} from "@/libs/course";
import {useRouter} from "@/i18n/navigation";

type Props = {
  enrollment: EnrollmentDto;
  swapToLesson: LessonDto;
}

export default function EnrollmentSubstitutionApplication(props: Props) {

  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const swap = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const swappedEnrollment = await applyEnrollmentSubstitution(props.enrollment.id, props.swapToLesson.id);
      router.replace(`/enrollment/${swappedEnrollment.id}/substitution/success`);
    } catch (e) {
      alert(t('EnrollmentSubstitutionApplication.swap-failed'));
    } finally {
      setIsLoading(false);
    }
  }, [props.swapToLesson, props.enrollment]);

  return (
    <LessonCardLarge lesson={props.swapToLesson}>
      <div>
        <button onClick={() => swap()} disabled={isLoading} className="w-full bg-primary text-white rounded-xl py-2 block text-center font-medium">
          {t('EnrollmentSubstitutionApplication.confirm-swap')}
        </button>
      </div>
    </LessonCardLarge>
  )
}