import {getTranslations} from "next-intl/server";
import BackButton from "@/components/back-button";
import {ChevronLeft, ChevronRight, CircleQuestionMark, Globe, LogOut, User, Volleyball} from "lucide-react";
import React from "react";
import {Link} from "@/i18n/navigation";
import Card from "@/components/card";

export default async function SettingsPage() {

  const t = await getTranslations();

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      <BackButton className="flex items-center gap-3">
        <div
          className="rounded-full border border-brand-neutral-300 w-[24px] h-[24px] flex items-center justify-center shadow cursor-pointer block">
          <ChevronLeft className="text-brand-neutral-900 size-5" strokeWidth={1.2}/>
        </div>
        <h1 className="font-semibold text-lg">{t('Settings.title')}</h1>
      </BackButton>

      <div className="mt-4 space-y-4">
        <Link href="/profile/settings" className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
              <User className="w-[24px] h-[24px] text-primary-500"/>
            </div>
            <div className="">{t('Settings.profile')}</div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
          </Card>
        </Link>
        <Link href="/" className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
              <Globe className="w-[24px] h-[24px] text-primary-500"/>
            </div>
            <div className="">{t('Settings.language')}</div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
          </Card>
        </Link>
        <Link href="/" className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
              <CircleQuestionMark className="w-[24px] h-[24px] text-primary-500"/>
            </div>
            <div className="">{t('Settings.about')}</div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
          </Card>
        </Link>
        <Link href="/auth/logout" className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-100 rounded-full">
              <LogOut className="w-[24px] h-[24px] text-brand-500"/>
            </div>
            <div className="">{t('Settings.logout')}</div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
          </Card>
        </Link>
      </div>
    </div>
  )
}