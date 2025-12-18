import BackButton from "@/components/back-button";
import {ChevronLeft} from "lucide-react";
import React from "react";
import CourseCardLarge from "@/components/course-card-large";
import {getTranslations} from "next-intl/server";
import {getInvoice} from "@/libs/invoice";
import {notFound} from "next/navigation";
import {getEnrolledCourse, getEnrollmentDeductible} from "@/libs/course";
import Checkout from "@/components/checkout";

type IProps = {
  searchParams: Promise<{
    invoiceId?: string;
    courseId?: string;
  }>;
}

export default async function PaymentCheckoutPage(props: IProps) {

  const t = await getTranslations();

  const { invoiceId, courseId } = await props.searchParams;

  const [invoice, course, deductibles] = await Promise.all([
    getInvoice(Number(invoiceId)),
    getEnrolledCourse(Number(courseId)),
    getEnrollmentDeductible()
  ]);
  if (!course || invoice.items.find(i => i.course?.id === course.id) == null) {
    notFound();
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
        <CourseCardLarge course={course}>
          <hr className="text-brand-neutral-200"/>
          <Checkout
            course={course}
            invoice={invoice}
            deductibles={deductibles}
          />
        </CourseCardLarge>
      </div>
    </div>
  )

}