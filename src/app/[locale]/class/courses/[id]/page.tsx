import {getTranslations} from "next-intl/server";
import {getCourse, getCourseEnrollmentStatus} from "@/libs/course";
import {Volleyball} from "lucide-react";
import {convertWeekdayToNumber} from "@/libs/weekday";
import moment from "moment/moment";
import React from "react";
import BackButton from "@/components/back-button";
import CourseHolidayPicker from "@/components/course-holiday-picker";
import {getMe} from "@/libs/user";

type Props = {
  params: Promise<{
    locale: string;
    id: number;
  }>;
}

export default async function CourseDetailPage(props: Props) {

  const t = await getTranslations();

  const { id } = await props.params;

  const [course, status, me] = await Promise.all([
    getCourse(id),
    getCourseEnrollmentStatus(id),
    getMe()
  ]);

  const lessons = course.lessons;
  const firstLesson = lessons && lessons.length > 0 ? lessons[0] : null;

  return (
    <div className="relative">
      <div className="aspect-[393/200] w-full bg-primary/10 flex items-center justify-center">
        <Volleyball className="size-12 text-primary"/>
      </div>
      <BackButton absolute={true} className="top-4 left-4" />
      <div className="container px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-1 flex justify-between items-center gap-1">
          <h1 className="font-semibold text-xl">{course.name}</h1>
          <div className="text-brand-neutral-500 whitespace-pre">
            {course.category2?.name}
            {lessons && lessons.length > 0 ? (
              <>
                {" · "}{course.lessons?.length}節
              </>
            ) : null}
          </div>
        </div>
        <p className="text-sm tracking-wider font-medium text-brand-neutral-500">{course.code}</p>

        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984M12 6V18M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="#002B76" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <p className="text-sm">
              HK${course.pricePerCourse ? course.pricePerCourse.toLocaleString() : (course.pricePerLesson! * (lessons?.length || 0)).toLocaleString()}/全期
            </p>
          </div>
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 1.5C9.81273 1.50248 7.71575 2.37247 6.16911 3.91911C4.62247 5.46575 3.75248 7.56273 3.75 9.75C3.75 16.8094 11.25 22.1409 11.5697 22.3641C11.6958 22.4524 11.846 22.4998 12 22.4998C12.154 22.4998 12.3042 22.4524 12.4303 22.3641C12.75 22.1409 20.25 16.8094 20.25 9.75C20.2475 7.56273 19.3775 5.46575 17.8309 3.91911C16.2843 2.37247 14.1873 1.50248 12 1.5ZM12 6.75C12.5933 6.75 13.1734 6.92595 13.6667 7.25559C14.1601 7.58524 14.5446 8.05377 14.7716 8.60195C14.9987 9.15013 15.0581 9.75333 14.9424 10.3353C14.8266 10.9172 14.5409 11.4518 14.1213 11.8713C13.7018 12.2909 13.1672 12.5766 12.5853 12.6924C12.0033 12.8081 11.4001 12.7487 10.8519 12.5216C10.3038 12.2946 9.83524 11.9101 9.50559 11.4167C9.17595 10.9234 9 10.3433 9 9.75C9 8.95435 9.31607 8.19129 9.87868 7.62868C10.4413 7.06607 11.2044 6.75 12 6.75Z"
                fill="#002B76"/>
            </svg>

            <p className="text-sm">{course.defaultRoom?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM17.25 12.75H12C11.8011 12.75 11.6103 12.671 11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V6.75C11.25 6.55109 11.329 6.36032 11.4697 6.21967C11.6103 6.07902 11.8011 6 12 6C12.1989 6 12.3897 6.07902 12.5303 6.21967C12.671 6.36032 12.75 6.55109 12.75 6.75V11.25H17.25C17.4489 11.25 17.6397 11.329 17.7803 11.4697C17.921 11.6103 18 11.8011 18 12C18 12.1989 17.921 12.3897 17.7803 12.5303C17.6397 12.671 17.4489 12.75 17.25 12.75Z"
                fill="#002B76"/>
            </svg>

            <p className="text-sm line-clamp-1">{firstLesson ? (
              <>
                星期{convertWeekdayToNumber(moment(firstLesson.date).day())}
                {" · "}
                {moment(firstLesson.date).format("MM月DD日")}
                {" · "}
                {firstLesson.startTime} - {firstLesson.endTime}
              </>
            ) : (
              <></>
            )}</p>
          </div>
        </div>

        <hr className="text-brand-neutral-200 my-5"/>

        <CourseHolidayPicker
          course={course}
          user={me}
          isFull={!status.canEnroll}
        />
      </div>
    </div>
  );
}
