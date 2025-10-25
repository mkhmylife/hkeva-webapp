'use client';

import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {ChevronLeft, ChevronRight} from "lucide-react";
import moment from "moment";
import {EnrollmentDto} from "@/types/enrollment";
import {useCallback, useMemo} from "react";
import {useRouter} from "@/i18n/navigation";

type Props = {
  enrollments: EnrollmentDto[];
}

export default function TimetableCalendar(props: Props) {

  const router = useRouter();

  const lessonDates = useMemo(() => {
    return props.enrollments.map(e => moment(e.lesson.date).toDate());
  }, [props.enrollments]);

  const onDateChange = useCallback((date: Date) => {
    router.replace(`/profile/timetable?date=${moment(date).format('YYYY-MM-DD')}`);
  }, [router]);

  return (
    <div className="">
      <Calendar
        onChange={(date) => onDateChange(new Date(date as never))}
        // value={field.value ? new Date(field.value) : null}
        minDate={new Date()}
        defaultActiveStartDate={lessonDates ? lessonDates[0] : undefined}
        prevLabel={<ChevronLeft strokeWidth={1.2} className="text-brand-neutral-900"/>}
        nextLabel={<ChevronRight strokeWidth={1.2} className="text-brand-neutral-900"/>}
        // tileClassName={({date, view}) =>
        //   view === 'month' && moment(date).isSame('', 'day')
        //     ? 'bg-white text-white'
        //     : 'bg-white'
        // }
        tileClassName={({date, view}) => {
          if (view === 'month') {
            const isLessonDate = lessonDates?.some(lessonDate => moment(lessonDate).isSame(date, 'day'));
            return isLessonDate ? 'is-active' : '';
          }
        }}
        view={'month'}
        className="border-0 bg-transparent"
        calendarType={'gregory'}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  )

}