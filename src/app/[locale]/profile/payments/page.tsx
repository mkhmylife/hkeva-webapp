import {getTranslations} from "next-intl/server";
import BackButton from "@/components/back-button";
import {ChevronLeft} from "lucide-react";
import React from "react";
import {getEnrolledCourses, getEnrollmentDeductible, getEnrollmentHolidays} from "@/libs/course";
import moment from "moment/moment";
import {Link} from "@/i18n/navigation";
import CourseCardLarge from "@/components/course-card-large";
import Card from "@/components/card";
import EnrollmentHolidayStatusCard from "@/components/enrollment-holiday-status-card";
import DeductibleCardsSwiper from "@/components/deductible-cards-swiper";
import InvoiceCountdown from "@/components/invoice-countdown";

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

  const [courses, deductibles, holidays] = await Promise.all([
    getEnrolledCourses(),
    getEnrollmentDeductible(),
    getEnrollmentHolidays(),
  ]);

  const paidCourses = courses.filter(c => c.invoiceItem.invoiceDue === 0);
  const pendingPaymentCourses = courses.filter(c => c.invoiceItem.invoiceDue > 0);

  const renderContent = () => {
    if (type === 'paid') {
      return (
        <div className="mt-4 space-y-4">
          {paidCourses.length === 0 ? (
            <Card className="h-[234px] flex justify-center items-center">
              <div className="font-semibold text-xl text-brand-neutral-900">
                {t('Home.no-enrollments')}
              </div>
            </Card>
          ) : null}
          {paidCourses.map(course => {
            return (
              <CourseCardLarge key={course.invoiceItem.id} course={course.course}>
                {course.invoiceItem ? (
                  <>
                    <hr className="text-brand-neutral-200"/>
                    <div className="pt-4">
                      <div className="text-right font-semibold text-xl">HK${course.invoiceItem.total.toLocaleString()}</div>
                      <div
                        className="text-right text-brand-neutral-500 text-sm mt-2">{t('Course.paid-at', {date: moment(course.invoiceItem.invoiceDate).format('YYYY-MM-DD HH:mm')})}</div>
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
          <DeductibleCardsSwiper deductibles={deductibles} />
          <h2 className="mt-5 font-semibold text-lg">{t('ProfilePayments.holiday-records')}</h2>
          <div className="mt-2 space-y-4">
            {holidays.map((holiday) => (
              <EnrollmentHolidayStatusCard
                key={holiday.id}
                enrollment={holiday}
              />
            ))}
            {holidays.length === 0 ? (
              <Card className="h-[234px] flex justify-center items-center">
                <div className="font-semibold text-xl text-brand-neutral-900">
                  {t('ProfilePayments.no-holiday-records')}
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      )
    }
    if (type === 'pending-payments' || !type) {
      return (
        <div className="mt-4 space-y-4">
          {pendingPaymentCourses.length === 0 ? (
            <Card className="h-[234px] flex justify-center items-center">
              <div className="font-semibold text-xl text-brand-neutral-900">
                {t('Home.no-enrollments')}
              </div>
            </Card>
          ) : null}
          {pendingPaymentCourses.map(course => {
            return (
              <Link key={course.invoiceItem.id} href={`/profile/payments/checkout?invoiceId=${course.invoiceItem.invoiceId}&courseId=${course.course.id}`} className="block">
                <CourseCardLarge course={course.course}>
                  {course.invoiceItem ? (
                    <>
                      <hr className="text-brand-neutral-200"/>
                      <div className="pt-4">
                        <div className="text-right font-semibold text-xl">HK${course.invoiceItem.total.toLocaleString()}</div>
                      </div>
                      <a className="cursor-pointer w-full bg-primary-100 rounded-xl py-2 px-6 mt-4 block text-center font-medium">
                        {t('ProfilePayments.goto-payment')}
                      </a>
                      <div className="mt-4">
                        <InvoiceCountdown
                          updatedAt={course.invoiceItem.updatedAt}
                          invoiceSource={course.invoiceItem.invoiceSource}
                        />
                      </div>
                    </>
                  ) : null}
                </CourseCardLarge>
              </Link>
            )
          })}
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
            className="bg-primary-900 rounded-full w-full grid grid-cols-3 gap-1 items-center justify-between text-white p-1">
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