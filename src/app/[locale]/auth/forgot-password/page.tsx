'use client';

import AuthHeader from "@/components/Auth/AuthHeader";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import InputField from "@/components/Form/InputField";
import React, {useCallback, useState} from "react";
import PhoneNumberInputField from "@/components/Form/PhoneNumberInputField";
import {Link, useRouter} from "@/i18n/navigation";
import {login, forgotPasswordVerifyPin, forgotPasswordSendPin} from "@/libs/auth";

interface ForgotPasswordFormDto {
  phoneNumber: string;
  pin: string;
}


export default function ForgotPasswordPage() {

  const t = useTranslations();

  const router = useRouter();

  const [step, setStep] = useState<'enterPhone' | 'verify'>('enterPhone');

  const { control, handleSubmit } = useForm<ForgotPasswordFormDto>({
    defaultValues: {
    }
  });

  const sendCode = useCallback(async (data: ForgotPasswordFormDto) => {
    const { phoneNumber } = data;
    if (!phoneNumber) {
      alert(t('loginScreen.please-fill-in-all-required-fields'));
      return;
    }

    try {
      await forgotPasswordSendPin(data);
      setStep('verify');
    } catch (e) {
      alert(t('forgotPasswordScreen.failedToSendCode'));
      console.error(e);
      return;
    }
  }, [router, t]);

  const verifyCode = useCallback(async (data: ForgotPasswordFormDto) => {
    const { phoneNumber, pin } = data;
    if (!phoneNumber || !pin) {
      alert(t('loginScreen.please-fill-in-all-required-fields'));
      return;
    }

    try {
      await forgotPasswordVerifyPin(data);
      router.replace('/auth/reset-password');
    } catch (e) {
      alert(t('forgotPasswordScreen.failedToVerifyCode'));
      console.error(e);
      return;
    }
  }, [router, t]);

  return (
    <div className="mx-auto max-w-7xl px-3">
      <AuthHeader active={'login'} showSegmentControl={true}/>

      <div className="mt-4 space-y-4">
        <h1 className="text-brand-neutral-900 font-semibold">{t('forgotPasswordScreen.title')}</h1>

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <PhoneNumberInputField
              label={t('registerScreen.phoneNumber')}
              isRequired={false}
              value={value}
              onChange={onChange}
            />
          )}
          name="phoneNumber"
        />

        {step === 'verify' ? (
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <div className="relative">
                <InputField
                  label={t('forgotPasswordScreen.enterPin')}
                  textInputProps={{
                    onBlur,
                    onChange,
                    value,
                    autoCapitalize: 'none',
                    autoComplete: 'password-new',
                    type: 'text',
                  }}
                />
                <a
                  className="text-xs text-brand-light-blue absolute right-0 top-1"
                >
                  {t('forgotPasswordScreen.sendAgain')}
                </a>
              </div>
            )}
            name="pin"
          />
        ) : null}

        {step === 'enterPhone' ? (
          <button
            onClick={handleSubmit(sendCode)}
            className="cursor-pointer mt-4 w-full bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            {t('forgotPasswordScreen.sendPin')}
          </button>
        ) : step === 'verify' ? (
          <button
            onClick={handleSubmit(verifyCode)}
            className="cursor-pointer mt-4 w-full bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            {t('forgotPasswordScreen.verify')}
          </button>
        ) : null}

      </div>

    </div>
  )

}