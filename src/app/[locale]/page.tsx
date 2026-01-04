import {getEnrollments} from "@/libs/course";
import EnrollmentCard from "@/components/enrollment-card";
import DateButtonsSwiper from "@/components/day-buttons-swiper";
import moment from "moment";
import Card from "@/components/card";
import {getTranslations} from "next-intl/server";
import ToDoCard from "@/components/todo-card";
import {Link} from "@/i18n/navigation";
import {LessonEnrollmentStatus} from "@/types/enrollment";
import {getToDos} from "@/libs/user";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function Home(props: Props) {

  const { date } = await props.searchParams;

  const t = await getTranslations();

  const selectedDate = date ? moment(date).toDate() : moment();

  const [enrollments, todayEnrollments, toDos] = await Promise.all([
    getEnrollments(),
    getEnrollments(selectedDate.toISOString()),
    getToDos()
  ]);

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      {todayEnrollments.length === 0 ? (
        <Card className="h-[234px] flex justify-center items-center">
          <div className="font-semibold text-xl text-brand-neutral-900">
            {t('Home.no-enrollments')}
          </div>
        </Card>
      ) : null}
      <div className="space-y-2">
        {todayEnrollments.map(enrollment => (
          <Link
            href={`/profile/timetable?date=${moment(enrollment.lesson.date).format('YYYY-MM-DD')}`}
            key={`today-enrollment-${enrollment.id}`}
            className="block"
          >
            <EnrollmentCard
              enrollment={enrollment}
              buttonType='status'
            />
          </Link>
        ))}
      </div>

      <div className="mt-2">
        <DateButtonsSwiper
          selectedDates={enrollments.map(e => moment(e.lesson.date).toDate())}
          baseUrl={`/`}
        />
      </div>

      <div className="mt-3">
        <h2 className="font-semibold text-lg">{t('Home.todo')}</h2>
        <div className="mt-2 space-y-3">
          {toDos.length === 0 ? (
            <div className="text-center text-gray-400 py-10">{t('Home.no-todos')}</div>
          ) : null}
          {toDos.map((item, index) => (
            <ToDoCard key={`todo-${index}`} toDo={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
