'use client';

import {Controller, useForm} from "react-hook-form";
import {useTranslations} from "next-intl";
import {CourseDto} from "@/types/courseDto";
import {InvoiceDto} from "@/types/invoiceDto";
import {EnrollmentDto, LessonEnrollmentStatus} from "@/types/enrollment";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Pencil} from "lucide-react";
import {applyPointsInInvoice, payInvoice, unapplyPointsInInvoice} from "@/libs/invoice";
import {useRouter} from "@/i18n/navigation";
import {getEnrollmentDeductible} from "@/libs/course";
import moment from "moment";
import {unstable_rethrow} from "next/navigation";
import FpsPayment from '@/components/fps-payment';
import InvoiceCountdown from '@/components/invoice-countdown';
import {canSubmitFpsPayment, isFpsPending} from '@/libs/fps-payment';

type IProps = {
  course: CourseDto;
  invoice: InvoiceDto;
  deductibles: EnrollmentDto[];
  fpsDetails: {id: string; accountName?: string};
}

type FormData = {
  points: number;
}

export default function Checkout(props: IProps) {

  const router = useRouter();

  const t = useTranslations();
  const { control, setValue } = useForm<FormData>();

  const [invoice, setInvoice] = useState<InvoiceDto>(props.invoice);
  const [deductibles, setDeductibles] = useState<EnrollmentDto[]>(props.deductibles);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'fps'>('online');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const fpsPending = isFpsPending(invoice);
  const isPaid = invoice.due <= 0;
  const fpsAvailable = props.course.acceptFpsPayment && canSubmitFpsPayment(invoice);

  // Update current time every second to trigger isExpired recalculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const usedPoints = useMemo(() => {
    let total = 0;
    for (const item of invoice.items) {
      const enrollments = item.enrollments?.filter(e => e.status === LessonEnrollmentStatus.InvoiceSwappedAsPoint);
      for (const enrollment of enrollments || []) {
        total += enrollment.value;
      }
    }
    return total;
  }, [invoice]);

  const points = useMemo(() => {
    const sorted = [...deductibles].sort((a, b) => b.value - a.value).slice(0, 2);
    let availablePoints = 0;
    for (const deductible of sorted) {
      if (availablePoints + deductible.value <= invoice.total) {
        availablePoints += deductible.value;
      }
    }
    return availablePoints;
  }, [deductibles, invoice.total]);

  const isExpired = useMemo(() => {
    if (fpsPending || isPaid) return false;
    const minutes = invoice.source === 'App' ? (invoice.stripeUrl ? 20 : 10) : 60 * 24 * 2;
    const expiryTime = moment(invoice.updatedAt).add(minutes, 'minutes');
    return moment(currentTime).isAfter(expiryTime);
  }, [invoice.updatedAt, invoice.source, invoice.stripeUrl, currentTime, fpsPending, isPaid]);

  const applyPoints = useCallback(async () => {
    if (isLoading || fpsPending || isPaid) return;
    setIsLoading(true);
    try {
      const updatedInvoice = await applyPointsInInvoice(invoice.id, points);
      setInvoice(updatedInvoice);
      setValue('points', points);
    } finally {
      setIsLoading(false);
    }
  }, [invoice.id, points, setValue, isLoading, fpsPending, isPaid]);

  const removePoints = useCallback(async () => {
    if (isLoading || fpsPending || isPaid) return;
    setIsLoading(true);
    try {
      const updatedInvoice = await unapplyPointsInInvoice(invoice.id);
      const updatedDeductibles = await getEnrollmentDeductible();
      setInvoice(updatedInvoice);
      setDeductibles(updatedDeductibles);
      setValue('points', 0);
    } finally {
      setIsLoading(false);
    }
  }, [invoice.id, setValue, isLoading, fpsPending, isPaid]);

  const checkout = useCallback(async (isMock: boolean) => {
    if (isLoading || fpsPending || isExpired || isPaid) return;
    if (invoice.stripeUrl) {
      window.location.href = invoice.stripeUrl;
      return;
    }
    setPaymentError(null);
    setIsLoading(true);
    try {
      const { paymentUrl } = await payInvoice(invoice.id, isMock);
      if (paymentUrl) {
        // ToDo: Redirect to payment URL
        window.location.href = paymentUrl;
        return;
      }
      router.replace(`/profile/payments?type=paid`);
    } catch (e) {
      unstable_rethrow(e);
      setPaymentError(t('Checkout.payment-failed'));
    } finally {
      setIsLoading(false);
    }
  }, [invoice.id, invoice.stripeUrl, router, t, isLoading, fpsPending, isExpired, isPaid]);

  return (
    <div>

      <div className="pt-4 text-right flex justify-end items-baseline">
        <div className="text-sm">{t('Checkout.subtotal')}</div>
        <div className="text-right">HK${(invoice.total + usedPoints).toLocaleString()}</div>
      </div>

      {!fpsPending && !isPaid && (usedPoints > 0 ? (
        <div className="">
          <Controller
            control={control}
            name="points"
            render={() => (
              <>
                <div className={`bg-primary relative rounded-lg text-sm p-2 mt-3`}>
                  <a onClick={() => removePoints()} className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <label className="flex items-center cursor-pointer relative">
                        <input type="checkbox" checked readOnly
                               className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-md"
                        />
                        <div
                          className="bg-white absolute text-brand-light-blue rounded opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"
                               stroke="currentColor" strokeWidth="1">
                            <path fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"></path>
                          </svg>
                        </div>
                      </label>
                      <p className="text-white">{t('Checkout.used-points')}</p>
                    </div>
                    <p className="text-white font-light pr-1">-HK${Number(usedPoints).toLocaleString()}</p>
                  </a>
                </div>
              </>
            )}
          />
        </div>
      ) : (
        <div className={points === 0 ? 'opacity-50 pointer-events-none' : ''}>
          <Controller
            control={control}
            name="points"
            render={({field}) => (
              <>
                <div className={`border border-brand-neutral-900 relative rounded-lg text-sm p-2 mt-3`}>
                  <>
                    <a onClick={() => applyPoints()} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={field.value ? field.value > 0 : false}
                        readOnly
                        className="w-4 h-4 text-blue-600 bg-brand-light-blue focus:ring-blue-500 focus:ring-2"
                      />
                      <p className="text-md">{t('Checkout.use-points')}</p>
                    </a>
                    <p className="mt-1 text-brand-neutral-500 font-light">{t('Checkout.use-points-to-save', {
                      // points: field.value ? field.value : props.invoice.total > points ? points : props.invoice.total,
                      save: field.value ? field.value : invoice.total > points ? points : invoice.total,
                    })}</p>
                    <div className="absolute top-0 right-0 p-2">
                      <Pencil className="size-3.5"/>
                    </div>
                  </>
                </div>
              </>
            )}
          />
        </div>
      ))}

      <div className="pt-4 text-right flex justify-end items-baseline">
        <div className="text-sm">{t('Checkout.total')}</div>
        <div className="text-right font-semibold text-2xl">HK${invoice.total.toLocaleString()}</div>
      </div>

      {fpsPending ? (
        <FpsPayment invoice={invoice} details={props.fpsDetails} disabled onSubmitted={setInvoice} onBusyChange={setIsLoading} />
      ) : isPaid ? (
        <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-center font-semibold text-green-800">{t('ProfilePayments.paid')}</p>
      ) : (
        <>
          {fpsAvailable ? (
            <fieldset disabled={isLoading || isExpired} className="mt-4 space-y-2">
              <legend className="mb-2 text-sm font-semibold">{t('Checkout.payment-method')}</legend>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-neutral-200 p-3">
                <input type="radio" name="payment-method" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                {t('Checkout.online-payment')}
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-neutral-200 p-3">
                <input type="radio" name="payment-method" value="fps" checked={paymentMethod === 'fps'} onChange={() => setPaymentMethod('fps')} />
                {t('FpsPayment.title')}
              </label>
            </fieldset>
          ) : null}

          {paymentMethod === 'fps' && fpsAvailable ? (
            <FpsPayment invoice={invoice} details={props.fpsDetails} disabled={isExpired || isLoading} onSubmitted={setInvoice} onBusyChange={setIsLoading} />
          ) : (
            <>
              <button
                onClick={() => checkout(false)}
                disabled={isExpired || isLoading}
                className={`w-full rounded-xl py-2 px-6 mt-4 block text-center font-medium ${
                  isExpired
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-brand-500 text-white cursor-pointer'
                }`}
              >
                {isExpired ? t('InvoiceCountdown.expired') : t('ProfilePayments.pay-now')}
              </button>

              {process.env.NEXT_PUBLIC_IS_BETA === "1" ? (
                <button
                  onClick={() => checkout(true)}
                  disabled={isExpired || isLoading}
                  className={`w-full rounded-xl py-2 px-6 mt-2 block text-center font-medium ${
                    isExpired
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-black text-white cursor-pointer'
                  }`}
                >
                  {isExpired ? t('InvoiceCountdown.expired') : 'Mock Payment'}
                </button>
              ) : null}
            </>
          )}
          {paymentError ? <p role="alert" className="mt-3 text-sm text-red-600">{paymentError}</p> : null}
          <div className="mt-4">
            <InvoiceCountdown updatedAt={invoice.updatedAt} invoiceSource={invoice.source} hasGatewayPayment={!!invoice.stripeUrl} />
          </div>
        </>
      )}

      {isLoading ? (
        <div className="bg-white/50 fixed inset-0 flex justify-center items-center">
          <div className="flex justify-center py-16">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-brand"
                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"/>
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"/>
            </svg>
          </div>
        </div>
      ) : null}
    </div>
  )

}
