import {getTranslations} from "next-intl/server";
import BackButton from "@/components/back-button";
import {ChevronLeft, WalletMinimal} from "lucide-react";
import React from "react";
import {getEnrolledCourses, getEnrollmentDeductible, getEnrollmentHolidays} from "@/libs/course";
import moment from "moment/moment";
import {Link} from "@/i18n/navigation";
import CourseCardLarge from "@/components/course-card-large";
import {CourseDto} from "@/types/courseDto";
import Card from "@/components/card";
import LessonCard from "@/components/lesson-card";
import EnrollmentCard from "@/components/enrollment-card";
import EnrollmentHolidayStatusCard from "@/components/enrollment-holiday-status-card";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    type?: string;
  }>;
}

export default async function ProfileTimetablePage(props: Props) {

  const { type } = await props.searchParams;

  const t = await getTranslations();

  const courses = await getEnrolledCourses();
  const deductibles = await getEnrollmentDeductible();
  const holidays = await getEnrollmentHolidays();

  const getInvoiceItem = (course: CourseDto) => {
    if (!course.lessons) return null;
    const enrollments = course.lessons.filter(l => l.enrollments).map(l => l.enrollments!).flat();
    const invoiceItems = enrollments.filter(ii => ii).map(e => e.invoiceItem!);
    const total = invoiceItems.reduce((a, b) => a + b.total, 0);
    const paidAt = invoiceItems.find(ii => ii.invoiceDate)?.invoiceDate || null;
    return {
      total,
      paidAt,
    }
  }

  const renderContent = () => {
    if (type === 'paid') {
      return (
        <div className="mt-4 space-y-4">
          {courses.map(course => {
            const invoiceItem = getInvoiceItem(course);
            return (
              <CourseCardLarge key={course.id} course={course}>
                {invoiceItem ? (
                  <>
                    <hr className="text-brand-neutral-200"/>
                    <div className="pt-4">
                      <div className="text-right font-semibold text-xl">HK${invoiceItem.total.toLocaleString()}</div>
                      <div
                        className="text-right text-brand-neutral-500 text-sm mt-2">{t('Course.paid-at', {date: moment(invoiceItem.paidAt).format('YYYY-MM-DD HH:mm')})}</div>
                    </div>
                  </>
                ) : null}
              </CourseCardLarge>
            )
          })}
        </div>
      )
    }
    if (type === 'deductible') {
      return (
        <div className="mt-4">
          <Card>
            <p className="text-sm font-medium">{t('ProfilePayments.deductible-amount')}</p>
            <div className="mt-3 flex gap-4">
              <WalletMinimal className="text-brand-neutral-500 size-8"/>
              <div className="text-4xl font-medium">
                HK${deductibles.total.toLocaleString()}
              </div>
            </div>
            <p
              className="mt-2 text-sm text-brand-neutral-500">{t('ProfilePayments.deductible-expired-at', {date: moment(deductibles.expiredAt).format('YYYY-MM-DD')})}</p>
          </Card>
          <h2 className="mt-5 font-semibold text-lg">{t('ProfilePayments.holiday-records')}</h2>
          <div className="mt-2 space-y-4">
            {holidays.map((holiday) => (
              <EnrollmentHolidayStatusCard key={holiday.id} enrollment={holiday} />
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      <BackButton className="flex items-center gap-3">
        <div
          className="rounded-full border border-brand-neutral-300 w-[24px] h-[24px] flex items-center justify-center shadow cursor-pointer block">
          <ChevronLeft className="text-brand-neutral-900 size-5" strokeWidth={1.2}/>
        </div>
        <h1 className="font-semibold text-lg">{t('ProfilePayments.title')}</h1>
      </BackButton>

      <div className="mt-3">
        <div className="mt-3 space-y-3">
          <div
            className="bg-primary-900 rounded-full w-full grid grid-cols-3 items-center justify-between text-white p-1">
            <Link replace href={`/profile/payments`}
                  className={`${!type || type === "pending-payments" ? 'bg-white text-primary-900' : ''} font-semibold py-1.5 cursor-pointer rounded-full hover:bg-white hover:text-primary-900 transition-colors flex items-center justify-center`}
            >
              {t('ProfilePayments.pending-payments')}
            </Link>
            <Link replace href={`/profile/payments?type=paid`}
              className={`${type === "paid" ? 'bg-white text-primary-900' : ''} font-semibold py-1.5 cursor-pointer rounded-full hover:bg-white hover:text-primary-900 transition-colors flex items-center justify-center`}
            >
              {t('ProfilePayments.paid')}
            </Link>
            <Link replace href={`/profile/payments?type=deductible`}
              className={`${type === "deductible" ? 'bg-white text-primary-900' : ''} font-semibold py-1.5 cursor-pointer rounded-full hover:bg-white hover:text-primary-900 transition-colors flex items-center justify-center`}
            >
              {t('ProfilePayments.deductible')}
            </Link>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  )

}