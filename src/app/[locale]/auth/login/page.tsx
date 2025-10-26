'use client';

import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import InputField from "@/components/Form/InputField";
import React, {useCallback} from "react";
import PhoneNumberInputField from "@/components/Form/PhoneNumberInputField";
import {Link, useRouter} from "@/i18n/navigation";
import {login} from "@/libs/auth";

interface LoginFormDto {
  phoneNumber: string;
  password: string;
}


export default function LoginPage() {

  const t = useTranslations();

  const router = useRouter();

  const { control, handleSubmit } = useForm<LoginFormDto>({
    defaultValues: {
    }
  });

  const onSubmit = useCallback(async (data: LoginFormDto) => {
    const { phoneNumber, password } = data;
    if (!phoneNumber || !password) {
      alert(t('Login.please-fill-in-all-required-fields'));
      return;
    }

    try {
      await login(data);  // Server action
      router.replace('/');
    } catch (e) {
      alert(t('Login.failed-to-login'));
      console.error(e);
      return;
    }
  }, [router, t]);


  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      {/*<AuthHeader active={'login'} showSegmentControl={true}/>*/}

      <div className="mt-4 space-y-4">
        <h1 className="text-brand-neutral-900 font-semibold">{t('Login.title')}</h1>

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <PhoneNumberInputField
              label={t('Login.phoneNumber')}
              isRequired={false}
              value={value}
              onChange={onChange}
            />
          )}
          name="phoneNumber"
        />

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <div className="relative">
              <InputField
                label={t('Login.password')}
                isRequired={true}
                textInputProps={{
                  onBlur,
                  onChange,
                  value,
                  autoCapitalize: 'none',
                  autoComplete: 'password-new',
                  type: 'password',
                }}
              />
              <Link
                href={"/auth/forgot-password"}
                className="text-xs text-brand-light-blue absolute right-0 top-1"
              >
                {t('Login.forgot-password')}
              </Link>
            </div>
          )}
          name="password"
        />

        <button
          onClick={handleSubmit(onSubmit)}
          className="mt-4 w-full bg-primary text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
        >
          {t('Login.login')}
        </button>
      </div>

    </div>
  )

}