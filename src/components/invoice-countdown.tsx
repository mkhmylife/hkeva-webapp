'use client';

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useTranslations } from 'next-intl';

type Props = {
  updatedAt: string;
  invoiceSource?: string;
}

export default function InvoiceCountdown(props: Props) {
  const { updatedAt, invoiceSource } = props;
  const minutes = invoiceSource === 'App' ? 10 : 60 * 24 * 2;
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  const t = useTranslations('InvoiceCountdown');

  useEffect(() => {
    const expiryTime = moment(updatedAt).add(minutes, 'minutes');

    const calculateTimeLeft = () => {
      const now = moment();
      const diff = expiryTime.diff(now);

      if (diff <= 0) {
        setIsExpired(true);
        return '00:00';
      }

      const duration = moment.duration(diff);
      const days = Math.floor(duration.asDays());
      const hours = Math.floor(duration.asHours()) % 24;
      const mins = Math.floor(duration.asMinutes()) % 60;
      const secs = Math.floor(duration.asSeconds()) % 60;

      if (days > 0) {
        return `${days}日${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      } else if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      } else {
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    };

    // Initial calculation
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [updatedAt, minutes]);

  if (isExpired) {
    return (
      <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-xs font-medium text-red-600 text-center">
          {t('expired')}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-xl">
      <p className="text-xs text-amber-900 text-center">
        {t('complete-payment-within', { timeLeft })}
      </p>
    </div>
  );
}