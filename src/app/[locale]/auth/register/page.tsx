'use client';

import AuthHeader from "@/components/Auth/AuthHeader";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import InputField from "@/components/Form/InputField";
import React, {useCallback, useEffect, useState} from "react";
import PhoneNumberInputField from "@/components/Form/PhoneNumberInputField";
import {Checkbox} from "@headlessui/react";
import {Link, useRouter} from "@/i18n/navigation";
import {CheckIcon} from "@heroicons/react/24/solid";
import {isEmailValid} from "@/libs/validation";
import {register} from "@/libs/auth";

interface RegisterFormDto {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female',
  acceptToc: boolean;
  referralCode?: string
}

export default function RegisterPage() {

  const t = useTranslations();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<RegisterFormDto>({
    defaultValues: {
      name: '',
      email: ''
    }
  });

  const onSubmit = useCallback(async (data: RegisterFormDto) => {
    const { name, email, phoneNumber, password, confirmPassword, gender, acceptToc } = data;
    if (!name || !email || !phoneNumber || !password || !confirmPassword || !gender) {
      alert(t('registerScreen.please-fill-in-all-required-fields'));
      return;
    }
    if (!isEmailValid(email)) {
      alert(t('registerScreen.please-fill-in-valid-email'));
      return;
    }
    if (password !== confirmPassword) {
      alert(t('registerScreen.password-does-not-match'));
      return;
    }
    if (!acceptToc) {
      alert(t('registerScreen.please-accept-toc'));
      return;
    }

    setIsLoading(true);
    try {
      await register(data); // Server action;
      router.replace('/');
    } catch (e) {
      if (e instanceof Error) {
        alert(t(e.message));
      } else {
        alert(t('registerScreen.failed-to-register'));
      }
      setIsLoading(false);
    }
  }, [router, t]);

  return (
    <div className="mx-auto max-w-7xl px-3">
      <AuthHeader active={'register'} showSegmentControl={true}/>

      <div className="mt-4 space-y-4">
        <h1 className="text-brand-neutral-900 font-semibold">{t('registerScreen.title')}</h1>

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <InputField
              label={t('registerScreen.name')}
              isRequired={true}
              textInputProps={{
                onBlur,
                onChange,
                value,
              }}
            />
          )}
          name="name"
        />

        <Controller
          control={control}
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: t('registerScreen.emailInvalid')
            }
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <InputField
              label={t('registerScreen.email')}
              isRequired={true}
              textInputProps={{
                onBlur,
                onChange,
                value,
              }}
            />
          )}
          name="email"
        />

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <InputField
              label={t('registerScreen.password')}
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
          )}
          name="password"
        />

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <InputField
              label={t('registerScreen.confirmPassword')}
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
          )}
          name="confirmPassword"
        />

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <PhoneNumberInputField
              label={t('registerScreen.phoneNumber')}
              isRequired={true}
              value={value}
              onChange={onChange}
            />
          )}
          name="phoneNumber"
        />

        <div className="flex gap-8">
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <div>
                <label className="text-sm font-sf-pro text-left text-brand-neutral-900">
                  {t('registerScreen.gender')} <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center mt-4 gap-10">
                  <div className="flex items-center">
                    <label htmlFor="male"
                           className="mr-2 text-sm font-semibold text-brand">
                      {t('registerScreen.male')}
                    </label>
                    <input id="male" type="radio" value="male" name="male"
                           checked={value === 'male'}
                           onChange={() => onChange('male')}
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"/>
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="female"
                           className="mr-2 text-sm font-semibold text-brand">
                      {t('registerScreen.female')}
                    </label>
                    <input id="female" type="radio" value="female" name="female"
                           checked={value === 'female'}
                           onChange={() => onChange('female')}
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"/>
                  </div>
                </div>
              </div>
            )}
            name="gender"
          />

          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <InputField
                label={t('registerScreen.referralCode')}
                isRequired={false}
                textInputProps={{
                  onBlur,
                  onChange,
                  value,
                }}
              />
            )}
            name="referralCode"
          />
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Controller
            control={control}
            name="acceptToc"
            render={({field: {onChange, value}}) => (
              <Checkbox
                checked={value}
                onChange={onChange}
                className="group size-5 rounded-md border border-brand bg-white/10 p-1 data-[checked]:bg-brand"
              >
                <CheckIcon
                  className="relative -left-[3px] -top-[2.5px] hidden size-4 fill-white group-data-[checked]:block"/>
              </Checkbox>
            )}
          />
          <div className="flex items-center text-sm">
            <label htmlFor="terms" className="text-gray-700">
              {t('registerScreen.acceptToc')}
            </label>
            <Link
              href={'/terms'}
              target="_blank"
              className="ml-1 font-bold underline text-gray-700 hover:text-brand"
            >
              {t('registerScreen.acceptTocLink')}
            </Link>
          </div>
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          className={`${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} relative mt-4 w-full bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors`}
        >
          {t('loginBox.register')}
          {isLoading && (
            <span className="ml-2 mt-1 absolute animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
          )}
        </button>
      </div>

    </div>
  )

}