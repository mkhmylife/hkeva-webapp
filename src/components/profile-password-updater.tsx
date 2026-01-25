'use client';

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { updatePassword } from "@/libs/auth";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import Card from "@/components/card";

type Input = {
  password: string;
  confirmPassword: string;
}

export default function ProfilePasswordUpdater() {
  const t = useTranslations();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Input>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: Input) => {
    if (data.password !== data.confirmPassword) {
      alert(t('Profile.passwords-do-not-match'));
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword({
        password: data.password,
      });
      alert(t('Profile.password-updated'));
      reset();
    } catch (e) {
      alert(t('Profile.password-update-failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
          <KeyRound className="w-[24px] h-[24px] text-primary-500"/>
        </div>
        <div className="font-medium">{t('Profile.update-password')}</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input
            type="password"
            placeholder={t('Profile.new-password')}
            {...register('password', { required: true })}
            className="w-full px-4 py-2 border border-brand-neutral-300 rounded-lg focus:outline-none focus:border-primary"
            disabled={isSubmitting}
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{t('Login.please-fill-in-all-required-fields')}</span>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder={t('Profile.confirm-password')}
            {...register('confirmPassword', { required: true })}
            className="w-full px-4 py-2 border border-brand-neutral-300 rounded-lg focus:outline-none focus:border-primary"
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs">{t('Login.please-fill-in-all-required-fields')}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-primary-600 transition-colors"
        >
          {isSubmitting ? t('Profile.uploading-pic') : t('Profile.update-password')}
        </button>
      </form>
    </Card>
  );
}
