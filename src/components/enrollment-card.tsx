import Card from "@/components/card";
import {getTranslations} from "next-intl/server";
import {convertWeekdayToNumber} from "@/libs/weekday";
import moment from "moment/moment";
import {Link} from "@/i18n/navigation";
import {EnrollmentDto, LessonEnrollmentStatus} from "@/types/enrollment";
import {getEnrollment} from "@/libs/course";
import BackButton from "@/components/back-button";

type Props = {
  enrollment: EnrollmentDto;
  buttonType?: 'leave-sub' | 'back';
  isSwap?: boolean;
}

export default async function EnrollmentCard(props: Props) {

  const t = await getTranslations();

  const lesson = props.enrollment.lesson;

  const enrollmentWithCount = await getEnrollment(props.enrollment.id);

  const renderButton = () => {
    if (props.buttonType === 'leave-sub') {
      if (props.enrollment.status === LessonEnrollmentStatus.Enrolled) {
        return (
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <Link href={`/enrollment/${props.enrollment.id}/leave`}
                  className="bg-primary-100 rounded-xl py-2 block text-center font-medium">
              {t('Lesson.apply-for-leave')}
            </Link>
            <Link href={`/enrollment/${props.enrollment.id}/substitution`}
                  className="bg-primary text-white rounded-xl py-2 block text-center font-medium">
              {t('Lesson.apply-for-substitution')}
            </Link>
          </div>
        )
      }
      if (props.enrollment.status === LessonEnrollmentStatus.Holiday) {
        return (
          <div className="mt-2.5 grid grid-cols-1 gap-2">
            <div className="bg-primary-100 opacity-50 rounded-xl py-2 block text-center font-medium">
              {t('Lesson.applied-for-leave')}
            </div>
          </div>
        );
      }
      if (props.enrollment.status === LessonEnrollmentStatus.Rescheduled) {
        return (
          <div className="mt-2.5 grid grid-cols-1 gap-2">
            <div className="bg-primary-100 opacity-50 rounded-xl py-2 block text-center font-medium">
              {t('Lesson.rescheduled')}
            </div>
          </div>
        );
      }
      return null;
    }
    return (
      <div className="mt-2.5 grid grid-cols-1 gap-2">
        <BackButton className="bg-primary-100 rounded-xl py-2 block text-center font-medium">
          {t('Lesson.select-other-lessons')}
        </BackButton>
      </div>
    )
  };

  const renderNextInfo = () => {
    return (
      <div className="pt-2 flex justify-between items-center text-xs mb-2">
        <p>{t('Lesson.next-lesson')}</p>
        <div className="bg-primary-100 py-[3px] px-2 font-medium rounded-2xl">{t('Lesson.num-of-lesson', {
          total: enrollmentWithCount.enrollmentCounts,
          i: enrollmentWithCount.enrollmentIndex
        })}</div>
      </div>
    )
  };

  return (
    <Card>
      {!props.isSwap ? renderNextInfo() : null}
      <div className="mb-2 flex justify-between items-center gap-1">
        <h2 className="font-semibold text-2xl line-clamp-1">
          {props.enrollment.swapFrom ? `(補)` : null}
          {lesson.course?.name}
        </h2>
        <div className="text text-brand-neutral-500 whitespace-pre">
          {lesson.course?.category2?.name}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 1.5C9.81273 1.50248 7.71575 2.37247 6.16911 3.91911C4.62247 5.46575 3.75248 7.56273 3.75 9.75C3.75 16.8094 11.25 22.1409 11.5697 22.3641C11.6958 22.4524 11.846 22.4998 12 22.4998C12.154 22.4998 12.3042 22.4524 12.4303 22.3641C12.75 22.1409 20.25 16.8094 20.25 9.75C20.2475 7.56273 19.3775 5.46575 17.8309 3.91911C16.2843 2.37247 14.1873 1.50248 12 1.5ZM12 6.75C12.5933 6.75 13.1734 6.92595 13.6667 7.25559C14.1601 7.58524 14.5446 8.05377 14.7716 8.60195C14.9987 9.15013 15.0581 9.75333 14.9424 10.3353C14.8266 10.9172 14.5409 11.4518 14.1213 11.8713C13.7018 12.2909 13.1672 12.5766 12.5853 12.6924C12.0033 12.8081 11.4001 12.7487 10.8519 12.5216C10.3038 12.2946 9.83524 11.9101 9.50559 11.4167C9.17595 10.9234 9 10.3433 9 9.75C9 8.95435 9.31607 8.19129 9.87868 7.62868C10.4413 7.06607 11.2044 6.75 12 6.75Z"
            fill="#002B76"/>
        </svg>
        <p className="">{lesson.room?.name}</p>
      </div>
      <div className="flex items-center gap-2 mb-2.5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM17.25 12.75H12C11.8011 12.75 11.6103 12.671 11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V6.75C11.25 6.55109 11.329 6.36032 11.4697 6.21967C11.6103 6.07902 11.8011 6 12 6C12.1989 6 12.3897 6.07902 12.5303 6.21967C12.671 6.36032 12.75 6.55109 12.75 6.75V11.25H17.25C17.4489 11.25 17.6397 11.329 17.7803 11.4697C17.921 11.6103 18 11.8011 18 12C18 12.1989 17.921 12.3897 17.7803 12.5303C17.6397 12.671 17.4489 12.75 17.25 12.75Z"
            fill="#002B76"/>
        </svg>
        <p className="line-clamp-1">
          <>
            星期{convertWeekdayToNumber(moment(lesson.date).day())}
            {" · "}
            {moment(lesson.date).format("MM月DD日")}
            {" · "}
            {lesson.startTime} - {lesson.endTime}
          </>
        </p>
      </div>
      <p className="text-xs tracking-wider font-medium text-brand-neutral-500">{lesson.course?.code}</p>
      {props.buttonType ? renderButton() : null}
      {props.isSwap ? renderNextInfo() : null}
    </Card>
  )

}