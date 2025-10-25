'use client';

import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {ChevronLeft, ChevronRight} from "lucide-react";
import moment from "moment";
import {CourseDto} from "@/types/courseDto";

type Props = {
  course: CourseDto;
}

export default function CourseCalendar(props: Props) {

  const lessonDates = props.course.lessons?.map(lesson => moment(lesson.date).toDate());

  return (
    <div className="">
      <Calendar
        // onChange={(date) => field.onChange(moment(date as Date).toISOString())}
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