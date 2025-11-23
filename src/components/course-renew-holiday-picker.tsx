'use client';

import {CourseDto} from "@/types/courseDto";
import CourseCalendar from "@/components/course-calendar";
import React, {useCallback, useMemo} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import moment from "moment";

type IProps = {
  course: CourseDto;
  fromCourseId: string;
}

export default function CourseRenewHolidayPicker(props: IProps) {

  const t = useTranslations();

  const [holidays, setHolidays] = React.useState<Date[]>([]);

  const onDatePicked = useCallback((date: Date) => {
    if (holidays.length >= 2) {
      alert(t('CourseRenew.only-two-holidays-can-be-picked'));
      return;
    }
    const isAlreadyPicked = holidays.some(holiday => holiday.getTime() === date.getTime());
    if (isAlreadyPicked) {
      setHolidays(holidays.filter(holiday => holiday.getTime() !== date.getTime()));
    } else {
      setHolidays([...holidays, date]);
    }
  }, [holidays, t]);

  const nextUrl = useMemo(() => {
    const sp = new URLSearchParams({
      fromCourseId: props.fromCourseId,
      toCourseId: props.course.id.toString(),
    });
    if (holidays.length >= 1) {
      sp.append('holiday1', moment(holidays[0]).format('YYYY-MM-DD'));
    }
    if (holidays.length === 2) {
      sp.append('holiday2', moment(holidays[1]).format('YYYY-MM-DD'));
    }
    return `/class/renew/step3?${sp.toString()}`;
  }, [holidays, props.fromCourseId, props.course.id]);

  return (
    <>
      <h2 className="font-semibold text-sm mb-2">{t('Course.select-lessons-that-cant-join')}：</h2>
      <div>
        {holidays.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-0">
            {holidays.map((holiday, index) => (
              <a
                key={index}
                onClick={() => {
                  setHolidays(holidays.filter(h => h.getTime() !== holiday.getTime()));
                }}
                className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full"
              >
                {holiday.toLocaleDateString()}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <CourseCalendar
        course={props.course}
        onChange={onDatePicked}
      />

      <Link
        href={nextUrl}
        className="block text-center mt-4 w-full bg-primary text-white font-semibold py-2.5 px-4 rounded-[12px] transition-colors"
      >
        {t('CourseRenew.next-step')}
      </Link>
    </>
  )

}