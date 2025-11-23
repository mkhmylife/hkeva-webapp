import {getTranslations} from "next-intl/server";
import {ChevronLeft, Shirt, User} from "lucide-react";
import {getMe} from "@/libs/user";
import Card from "@/components/card";
import BackButton from '@/components/back-button';
import React from "react";
import ProfilePicUploader from '@/components/profile-pic-uploader';
import ProfileClothesSizePicker from "@/components/profile-clothes-size-picker";

export default async function ProfilePage() {

  const t = await getTranslations();

  const me = await getMe();

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      <BackButton className="flex items-center gap-3">
        <div
          className="rounded-full border border-brand-neutral-300 w-[24px] h-[24px] flex items-center justify-center shadow cursor-pointer block">
          <ChevronLeft className="text-brand-neutral-900 size-5" strokeWidth={1.2}/>
        </div>
        <h1 className="font-semibold text-lg">{t('Settings.profile')}</h1>
      </BackButton>

      <div className="flex gap-5 mt-5">
        <div className="bg-primary-100 aspect-square rounded-full w-[69px] h-[69px] flex items-center justify-center">
          {me.profilePicUrl ? (
            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/members/images/${me.profilePicUrl}`} alt=""
                 className="w-full aspect-square rounded-full shadow overflow-hidden object-cover"/>
          ) : (
            <User className="text-primary size-8"/>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="font-semibold text-xl">{me.name}</p>
            <div className="bg-primary-100 text-primary rounded-full py-1 px-2.5 text-xs">
              {me.level}
            </div>
          </div>
          <div className="mt-1.5 flex gap-3 text-xs text-brand-neutral-500">
            <p>{me.tel}</p>
            <p>{me.email}</p>
          </div>
          <p className="mt-0.5 flex gap-3 text-xs text-brand-neutral-500">{me.code}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 font-medium">
        <ProfilePicUploader label={t('Profile.upload-pic')} className="flex gap-3 items-center" />
        <ProfileClothesSizePicker />
      </div>

    </div>
  )

}