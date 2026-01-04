'use client';

import {CourseDto} from "@/types/courseDto";
import CourseCalendar from "@/components/course-calendar";
import React, {useCallback, useMemo, useState} from "react";
import {useTranslations} from "next-intl";
import {Link, useRouter} from "@/i18n/navigation";
import moment from "moment";
import {AuthUserDto} from "@/types/userDto";
import {Dialog, DialogPanel} from "@headlessui/react";

type IProps = {
  course: CourseDto;
  user: AuthUserDto;
  isFull?: boolean;
}

export default function CourseHolidayPicker(props: IProps) {

  const router = useRouter();
  const t = useTranslations();

  const [holidays, setHolidays] = useState<Date[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const apply = useCallback(() => {
    const sp = new URLSearchParams();
    if (holidays.length >= 1) {
      sp.append('holiday1', moment(holidays[0]).format('YYYY-MM-DD'));
    }
    if (holidays.length === 2) {
      sp.append('holiday2', moment(holidays[1]).format('YYYY-MM-DD'));
    }
    router.replace(`/class/courses/${props.course.id}/enroll?${sp.toString()}`);
    setIsOpen(false);
  }, [holidays, props.course.id, router]);

  const canUserEnroll = useMemo(() => {
    if (props.user.category) {
      return props.user.category.order >= (props.course.category2?.order || 0);
    }
    return true;
  }, [props.course.category2?.order, props.user.category]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="block text-center mt-4 w-full border-primary border text-primary bg-white font-semibold py-2.5 px-4 rounded-[12px] transition-colors">
        {t('Course.select-lessons-that-cant-join')}
      </button>
      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
      <div className="fixed inset-0 bg-black/50 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="relative">
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

              <button
                onClick={() => apply()}
                className="block text-center mt-4 w-full bg-primary text-white font-semibold py-2.5 px-4 rounded-[12px] transition-colors"
              >
                {canUserEnroll ? (
                  <>
                    {props.isFull ? (
                      <>
                        {t('CourseRenew.is-full')}
                      </>
                    ) : (
                      <>
                        {t('CourseRenew.next-step')}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {t('CourseRenew.grade-too-low-to-enroll')}
                  </>
                )}
              </button>

              {!canUserEnroll || props.isFull ? (
                <div className="absolute bg-background/50 h-full w-full inset-0" />
              ) : null}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
    </>
  )

}