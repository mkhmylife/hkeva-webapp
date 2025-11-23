import {getTranslations} from "next-intl/server";
import BackButton from "@/components/back-button";
import {ChevronLeft} from "lucide-react";
import React from "react";
import {getEnrollments} from "@/libs/course";
import Card from "@/components/card";
import EnrollmentCard from "@/components/enrollment-card";
import TimetableCalendar from "@/components/timetable-calendar";
import moment from "moment/moment";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function ProfileTimetablePage(props: Props) {

  const { date } = await props.searchParams;

  const t = await getTranslations();

  const selectedDate = date ? moment(date) : moment();
  const enrollments = await getEnrollments();
  const todayEnrollments = await getEnrollments(selectedDate.toISOString());

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      <BackButton className="flex items-center gap-3">
        <div
          className="rounded-full border border-brand-neutral-300 w-[24px] h-[24px] flex items-center justify-center shadow cursor-pointer block">
          <ChevronLeft className="text-brand-neutral-900 size-5" strokeWidth={1.2}/>
        </div>
        <h1 className="font-semibold text-lg">{t('ProfileTimetable.title')}</h1>
      </BackButton>

      <div className="mt-3">
        {todayEnrollments.length > 0 ? (
          <div className="space-y-3">
            {todayEnrollments.map(enrollment => (
              <EnrollmentCard
                key={`today-enrollment-${enrollment.id}`}
                enrollment={enrollment}
                buttonType='leave-sub'
              />
            ))}
          </div>
        ) : (
          <Card className="h-[234px] flex justify-center items-center">
            <div className="font-semibold text-xl text-brand-neutral-900">
              {t('Home.no-enrollments')}
            </div>
          </Card>
        )}
      </div>

      <div className="mt-3">
        <TimetableCalendar
          enrollments={enrollments}
          initialDate={selectedDate.toISOString()}
        />
      </div>
    </div>
  )

}