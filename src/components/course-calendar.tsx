'use client';

import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {ChevronLeft, ChevronRight} from "lucide-react";
import moment from "moment";
import {CourseDto} from "@/types/courseDto";
import {useCallback, useState} from "react";

type Props = {
  course: CourseDto;
  onChange?: (date: Date) => void;
}

export default function CourseCalendar(props: Props) {

  const lessonDates = props.course.lessons?.map(lesson => moment(lesson.date).toDate());

  const [value, setValue] = useState<Date|null>();

  const onChange = useCallback((date: Date) => {
    if (props.onChange) {
      const isLessonDate = lessonDates?.some(lessonDate => moment(lessonDate).isSame(date, 'day'));
      if (isLessonDate) {
        props.onChange(date);
        setValue(null); // Clear selection after picking
      }
    }
  }, [lessonDates, props]);

  return (
    <div className="">
      <Calendar
        onChange={(date) => onChange(date as Date)}
        value={value}
        minDate={new Date()}
        defaultActiveStartDate={lessonDates ? lessonDates[0] : undefined}
        prevLabel={<ChevronLeft strokeWidth={1.2} className="text-brand-neutral-900"/>}
        nextLabel={<ChevronRight strokeWidth={1.2} className="text-brand-neutral-900"/>}
        tileClassName={({date, view}) => {
          if (view === 'month') {
            const isLessonDate = lessonDates?.some(lessonDate => moment(lessonDate).isSame(date, 'day'));
            return isLessonDate ? 'is-active' : '';
          }
        }}
        view={'month'}
        className="border-0 bg-transparent w-full!"
        calendarType={'gregory'}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  )

}