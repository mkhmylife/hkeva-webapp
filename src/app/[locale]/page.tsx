import {getEnrollments} from "@/libs/course";
import EnrollmentCard from "@/components/enrollment-card";
import DateButtonsSwiper from "@/components/day-buttons-swiper";
import moment from "moment";
import Card from "@/components/card";
import {getTranslations} from "next-intl/server";
import ToDoCard from "@/components/todo-card";
import {Link} from "@/i18n/navigation";

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
  const enrollments = await getEnrollments();
  const todayEnrollments = await getEnrollments(selectedDate.toISOString());

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      {todayEnrollments.length === 0 ? (
        <Card className="h-[234px] flex justify-center items-center">
          <div className="font-semibold text-xl text-brand-neutral-900">
            {t('Home.no-enrollments')}
          </div>
        </Card>
      ) : null}
      <div className="space-y-3">
        {todayEnrollments.map(enrollment => (
          <EnrollmentCard
            key={`today-enrollment-${enrollment.id}`}
            enrollment={enrollment}
            buttonType='leave-sub'
          />
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
          {[1,2,3].map((item) => (
            <Link href={`/class/courses`} className="block" key={`todo-link-${item}`}>
              <ToDoCard />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
