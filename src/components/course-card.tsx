import {useTranslations} from "next-intl";
import Card from "@/components/card";
import {CourseDto} from "@/types/courseDto";
import {Clock3, MapPin, Volleyball} from "lucide-react";
import moment from "moment";
import {convertWeekdayToNumber} from "@/libs/weekday";

type Props = {
  course: CourseDto;
}

export default function CourseCard(props: Props) {

  const t = useTranslations();

  const { course } = props;

  const firstLessson = course.lessons && course.lessons.length > 0 ? course.lessons[0] : null;

  return (
    <Card className="flex gap-3 items-center">
      <div className="aspect-square bg-primary/10 h-24 rounded-[12px] flex items-center justify-center">
        <Volleyball className="size-8 text-primary" />
      </div>
      <div className="w-full">
        <div className="mb-1.5 flex justify-between items-center gap-1">
          <h2 className="font-semibold line-clamp-1">{course.name}</h2>
          <div className="text-sm text-brand-neutral-500 whitespace-pre">
            {course.category2?.name}
            {firstLessson ? (
              <>
                {" · "}{course.lessons?.length}節
              </>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 1C6.54182 1.00165 5.14383 1.58165 4.11274 2.61274C3.08165 3.64383 2.50165 5.04182 2.5 6.5C2.5 11.2063 7.5 14.7606 7.71313 14.9094C7.7972 14.9683 7.89735 14.9999 8 14.9999C8.10265 14.9999 8.2028 14.9683 8.28687 14.9094C8.5 14.7606 13.5 11.2063 13.5 6.5C13.4983 5.04182 12.9184 3.64383 11.8873 2.61274C10.8562 1.58165 9.45818 1.00165 8 1ZM8 4.5C8.39556 4.5 8.78224 4.6173 9.11114 4.83706C9.44004 5.05682 9.69638 5.36918 9.84776 5.73463C9.99913 6.10009 10.0387 6.50222 9.96157 6.89018C9.8844 7.27814 9.69392 7.63451 9.41421 7.91421C9.13451 8.19392 8.77814 8.3844 8.39018 8.46157C8.00222 8.53874 7.60009 8.49913 7.23463 8.34776C6.86918 8.19638 6.55682 7.94004 6.33706 7.61114C6.1173 7.28224 6 6.89556 6 6.5C6 5.96957 6.21071 5.46086 6.58579 5.08579C6.96086 4.71071 7.46957 4.5 8 4.5Z"
              fill="#002B76"/>
          </svg>
          <p className="text-xs">{course.defaultRoom?.name || '待定'}</p>
          {course.defaultRoom ? (
            <>
              {!course.isFixedRoom ? (
                <div className="text-[10px] text-[#911D06] bg-[#FED2A1] rounded-full py-0.5 px-1.5 font-medium">{t('Course.not-fixed-room')}</div>
              ) : (
                <div className="text-[10px] text-[#116608] bg-[#D5FAAA] rounded-full py-0.5 px-1.5 font-medium">{t('Course.fixed-room')}</div>
              )}
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM11.5 8.5H8C7.86739 8.5 7.74022 8.44732 7.64645 8.35355C7.55268 8.25979 7.5 8.13261 7.5 8V4.5C7.5 4.36739 7.55268 4.24021 7.64645 4.14645C7.74022 4.05268 7.86739 4 8 4C8.13261 4 8.25979 4.05268 8.35356 4.14645C8.44732 4.24021 8.5 4.36739 8.5 4.5V7.5H11.5C11.6326 7.5 11.7598 7.55268 11.8536 7.64645C11.9473 7.74021 12 7.86739 12 8C12 8.13261 11.9473 8.25979 11.8536 8.35355C11.7598 8.44732 11.6326 8.5 11.5 8.5Z"
              fill="#002B76"/>
          </svg>
          <p className="text-xs line-clamp-1">{firstLessson ? (
            <>
              星期{convertWeekdayToNumber(moment(firstLessson.date).day())}
              {" · "}
              {moment(firstLessson.date).format("MM月DD日")}
              {" · "}
              {firstLessson.startTime} - {firstLessson.endTime}
            </>
          ) : (
            <></>
          )}</p>
        </div>
        <p className="text-xs tracking-wider font-medium text-brand-neutral-500">{course.code}</p>
      </div>
    </Card>
  )

}