'use client';

import React from "react";
import {useRouter} from "@/i18n/navigation";
import {useTranslations} from "next-intl";

export interface AuthSegmentControlProps {
  active: 'login' | 'register';
}

const AuthSegmentControl = ({ active }: AuthSegmentControlProps) => {

  const t = useTranslations();

  const router = useRouter();

  const activeClasses = "bg-brand text-white";
  const inactiveClasses = "text-brand";
  const baseClasses = "py-2 px-5 justify-center rounded-full items-center flex-1 flex items-center justify-center";

  return (
    <div className="rounded-full bg-gray-100 w-full p-1 flex gap-2">
      {active === 'login' ? (
        <>
          <div className={`${baseClasses} ${activeClasses}`}>
            <span className="font-semibold text-sm">{t('loginBox.login')}</span>
          </div>
          <button
            onClick={() => router.replace('/auth/register')}
            className={`${baseClasses} ${inactiveClasses}`}
          >
            <span className="font-semibold text-sm">{t('loginBox.register')}</span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => router.replace('/auth/login')}
            className={`${baseClasses} ${inactiveClasses}`}
          >
            <span className="font-semibold text-sm">{t('loginBox.login')}</span>
          </button>
          <div className={`${baseClasses} ${activeClasses}`}>
            <div className="text-center font-semibold text-sm">{t('loginBox.register')}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthSegmentControl;