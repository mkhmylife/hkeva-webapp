'use client';

import {Swiper, SwiperRef, SwiperSlide} from "swiper/react";
import DayButton from "@/components/day-button";
import 'swiper/css';
import moment from "moment";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "@/i18n/navigation";
import {useSearchParams} from "next/navigation";

type Props = {
  selectedDates?: Date[];
  baseUrl?: string;
}

export default function DateButtonsSwiper(props: Props) {

  const swiperRef = useRef<SwiperRef>(null);

  const router = useRouter();

  const params = useSearchParams();
  const selectedDateParam = params.get('date');

  const dates = useMemo(() => {
    // Build a dates array that starts at the Sunday of the current week
    // and includes that week's 7 days plus the following 60 days (67 days total).
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setHours(0, 0, 0, 0);
    // getDay(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const FUTURE_DAYS = 60; // days after the current week
    const DAYS_THIS_WEEK = 7;
    const totalDays = DAYS_THIS_WEEK + FUTURE_DAYS; // 67

    const dates: Date[] = [];
    // Use a base timestamp and add 24h multiples so we don't accidentally
    // get shifted by DST when using setDate repeatedly.
    const baseTime = startOfWeek.getTime();
    const DAY_MS = 24 * 60 * 60 * 1000;
    for (let i = 0; i < totalDays; i++) {
      dates.push(new Date(baseTime + i * DAY_MS));
    }
    return dates;
  }, []);

  const isSelected = useCallback((d: Date) => {
    if (!selectedDateParam) {
      return moment(d).isSame(moment(), 'day');
    }
    return moment(d).isSame(selectedDateParam, 'day');
  }, [selectedDateParam]);

  const clickHandler = useCallback((date: Date) => {
    if (!props.baseUrl) {
      return;
    }
    const dateStr = moment(date).format('YYYY-MM-DD');
    const url = `${props.baseUrl}?date=${dateStr}`;
    router.replace(url);
  }, [props.baseUrl, router]);

  useEffect(() => {
    if (selectedDateParam) {
      const i = dates.findIndex(d => moment(d).isSame(selectedDateParam, 'day'));
      if (i >= 0 && swiperRef.current) {
        swiperRef.current.swiper.slideTo(i - 3 >= 0 ? i -3 : 0);
      }
    } else {
      swiperRef.current?.swiper.slideTo(0);
    }
  }, [dates, selectedDateParam]);

  return (
    <div>
      <Swiper
        ref={swiperRef}
        spaceBetween={5}
        slidesPerView={7}
      >
        {dates.map((date, index) => (
          <SwiperSlide key={date.toISOString()} className="">
            <a onClick={() => clickHandler(date)} className="mb-2 block">
              <DayButton
                date={date}
                isEnrolled={!!props.selectedDates?.find(d => moment(d).isSame(date, 'day'))}
                isSelected={isSelected(date)}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )

}