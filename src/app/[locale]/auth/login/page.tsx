'use client';

import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import InputField from "@/components/Form/InputField";
import React, {useCallback, useState} from "react";
import PhoneNumberInputField from "@/components/Form/PhoneNumberInputField";
import {useRouter} from "@/i18n/navigation";
import {login, loginPickStudents, loginWithStudentToken} from "@/libs/auth";
import Card from "@/components/card";
import {User} from "lucide-react";

interface LoginFormDto {
  phoneNumber: string;
  password: string;
}


export default function LoginPage() {

  const t = useTranslations();

  const router = useRouter();

  const [students, setStudents] = useState<Array<{id: number; name: string; accessToken: string; code: string}>>([]);

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
      const students = await loginPickStudents(data);
      if (students.length === 0) {
        alert(t('Login.failed-to-login'));
        return;
      }
      if (students.length === 1) {
        await login(data);  // Server action
        router.replace('/');
        return;
      }
      setStudents(students);
    } catch (e) {
      alert(t('Login.failed-to-login'));
      console.error(e);
    }
  }, [router, t]);

  const onSelectStudent = useCallback(async (accessToken: string) => {
    try {
      await loginWithStudentToken(accessToken);
      router.replace('/');
    } catch (e) {
      alert(t('Login.failed-to-login'));
      console.error(e);
    }
  }, [router, t]);

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      {/*<AuthHeader active={'login'} showSegmentControl={true}/>*/}

      {students.length === 0 ? (
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
                {/*<Link*/}
                {/*  href={"/auth/forgot-password"}*/}
                {/*  className="text-xs text-brand-light-blue absolute right-0 top-1"*/}
                {/*>*/}
                {/*  {t('Login.forgot-password')}*/}
                {/*</Link>*/}
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
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStudents([])}
              className="text-brand-neutral-400 hover:text-brand-neutral-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <h1 className="text-brand-neutral-900 font-semibold">{t('Login.pick-student')}</h1>
          </div>

          <div className="space-y-3">
            {students.map(student => (
              <button
                key={student.id}
                onClick={() => onSelectStudent(student.accessToken)}
                className="w-full text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Card className="flex gap-3 items-center">
                  <div className="w-[48px] h-[48px] flex items-center justify-center bg-primary/10 rounded-full">
                    <User className="w-[24px] h-[24px] text-primary"/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-neutral-900">{student.name}</h3>
                    <p className="text-sm text-brand-neutral-500">{t('Login.student-id')}: {student.code}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-neutral-300">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )

}