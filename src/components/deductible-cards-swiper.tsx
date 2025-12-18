'use client';

import {Swiper, SwiperRef, SwiperSlide} from "swiper/react";
import React, {useRef} from "react";
import {WalletMinimal} from "lucide-react";
import {EnrollmentDto} from "@/types/enrollment";
import Card from "@/components/card";
import moment from "moment";
import {useTranslations} from "next-intl";
import 'swiper/css';

type IProps = {
  deductibles: EnrollmentDto[];
}

export default function DeductibleCardsSwiper(props: IProps) {

  const swiperRef = useRef<SwiperRef>(null);

  const t = useTranslations();

  if (props.deductibles.length === 0) {
    return (
      <Card>
        <p className="text-sm font-medium">{t('ProfilePayments.deductible-amount')}</p>
        <div className="flex gap-4 mt-3">
          <WalletMinimal className="text-brand-neutral-500 size-8"/>
          <div className="text-4xl font-medium">
            HK$0
          </div>
        </div>
        <p
          className="mt-2 text-sm text-brand-neutral-500"></p>
      </Card>
    )
  }

  return (
    <Swiper
      ref={swiperRef}
      spaceBetween={12}
      slidesPerView={props.deductibles.length === 1 ? 1 : 1.1}
      className="-mx-1"
    >
      {props.deductibles.map(enrollment => (
        <SwiperSlide key={enrollment.id} className="mb-2 px-1">
          <Card>
            <p className="text-sm font-medium">{t('ProfilePayments.deductible-amount')}</p>
            <div className="flex gap-4 mt-3">
              <WalletMinimal className="text-brand-neutral-500 size-8"/>
              <div className="text-4xl font-medium">
                HK${enrollment.value.toLocaleString()}
              </div>
            </div>
            <p
              className="mt-2 text-sm text-brand-neutral-500">{t('ProfilePayments.deductible-expired-at', {date: moment(enrollment.expiredAt).format('YYYY-MM-DD')})}</p>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  )

}