import {getTranslations} from "next-intl/server";
import {getCourse, getCourseEnrollmentStatus} from "@/libs/course";
import {ChevronLeft} from "lucide-react";
import {convertWeekdayToNumber} from "@/libs/weekday";
import moment from "moment/moment";
import React from "react";
import BackButton from "@/components/back-button";
import CourseCardLarge from "@/components/course-card-large";
import CourseEnrollButton from "@/components/course-enroll-button";
import CourseHolidayPicker from "@/components/course-holiday-picker";
import {getMe} from "@/libs/user";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
  searchParams: Promise<{
    holiday1?: string;
    holiday2?: string;
  }>;
}

export default async function CourseDetailPage(props: Props) {

  const t = await getTranslations();

  const { id: courseId } = await props.params;
  const { holiday1, holiday2 } = await props.searchParams;
  const [course, me] = await Promise.all([
    getCourse(Number(courseId)),
    getMe()
  ]);
  const lessons = course.lessons;
  const firstLesson = lessons && lessons.length > 0 ? lessons[0] : null;
  const enrolledLessons = lessons?.filter((lesson) => {
    const isHoliday = lesson.date === holiday1 || lesson.date === holiday2;
    return !isHoliday;
  });

  return (
    <div className="relative">
      <div className="container px-4 sm:px-6 lg:px-8">
        <BackButton className="flex items-center gap-3">
          <div className="rounded-full border border-brand-neutral-300 w-[24px] h-[24px] flex items-center justify-center shadow cursor-pointer block">
            <ChevronLeft className="text-brand-neutral-900 size-5" strokeWidth={1.2} />
          </div>
          <h1 className="text-lg font-semibold">{t('Course.confirm-enrollment')}</h1>
        </BackButton>

        <div className="mt-2">
          <CourseCardLarge course={course}>
            <div className="">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM17.25 12.75H12C11.8011 12.75 11.6103 12.671 11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V6.75C11.25 6.55109 11.329 6.36032 11.4697 6.21967C11.6103 6.07902 11.8011 6 12 6C12.1989 6 12.3897 6.07902 12.5303 6.21967C12.671 6.36032 12.75 6.55109 12.75 6.75V11.25H17.25C17.4489 11.25 17.6397 11.329 17.7803 11.4697C17.921 11.6103 18 11.8011 18 12C18 12.1989 17.921 12.3897 17.7803 12.5303C17.6397 12.671 17.4489 12.75 17.25 12.75Z"
                    fill="#002B76"/>
                </svg>

                <p className="text line-clamp-1">
                  <>
                    星期{convertWeekdayToNumber(moment(firstLesson?.date).day())}
                    {" · "}
                    {moment(firstLesson?.date).format("MM月DD日")}
                    {" · "}
                    {firstLesson?.startTime} - {firstLesson?.endTime}
                  </>
                </p>
              </div>
              <div className="grid grid-cols-5 gap-2 pt-3 border-b border-gray-200 pb-3">
                {lessons?.map((lesson) => {
                  const isHoliday = lesson.date === holiday1 || lesson.date === holiday2;
                  return (
                    <div
                      key={lesson.id}
                      className={`${isHoliday ? 'opacity-40' : ''} border border-gray-200 text-center text-brand-neutral-900 text-sm rounded-xl py-2 px-2`}
                    >
                      {moment(lesson.date).format("D/MM")}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-end mt-3 text-xl font-bold">
                HK${course.pricePerCourse ? course.pricePerCourse.toLocaleString() : (course.pricePerLesson! * (enrolledLessons?.length || 0)).toLocaleString()}
              </div>
            </div>
          </CourseCardLarge>
        </div>

        <CourseHolidayPicker
          course={course}
          user={me}
        />

        <CourseEnrollButton
          course={course}
          holidays={[holiday1, holiday2].filter(h => h !== undefined)}
        />
      </div>
    </div>
  );
}
