import {getTranslations} from "next-intl/server";
import {CalendarCheck, User} from "lucide-react";
import {getMe} from "@/libs/user";
import Card from "@/components/card";
import {getEnrollments} from "@/libs/course";
import EnrollmentCard from "@/components/enrollment-card";
import {Link} from "@/i18n/navigation";
import React from "react";
import {getStudents} from "@/libs/auth";
import StudentSwitcher from "@/components/student-switcher";

export default async function ProfilePage() {

  const t = await getTranslations();

  const [me, enrollments, students] = await Promise.all([
    getMe(),
    getEnrollments(),
    getStudents()
  ]);

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-md">{t('Profile.title')}</h1>
        <StudentSwitcher currentUserId={me.id} students={students} />
      </div>

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

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link href="/profile/timetable">
          <Card className="flex justify-center items-center gap-2">
            <div className="bg-primary-100 aspect-square rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <CalendarCheck className="text-primary-500"/>
            </div>
            <p className="font-semibold">{t('Profile.timetable')}</p>
          </Card>
        </Link>
        <Link href="/profile/payments">
          <Card className="flex justify-center items-center gap-2">
            <div className="bg-primary-100 aspect-square rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <CalendarCheck className="text-primary-500"/>
            </div>
            <p className="font-semibold">{t('Profile.payment')}</p>
          </Card>
        </Link>
      </div>

      <h1 className="font-semibold text-md mt-5">{t('Profile.my-lessons')}</h1>
      <div className="space-y-3 mt-2">
        {enrollments.length === 0 ? (
          <Card className="h-[234px] flex justify-center items-center">
            <div className="font-semibold text-xl text-brand-neutral-900">
              {t('Home.no-enrollments')}
            </div>
          </Card>
        ) : null}
        {enrollments.map((enrollment) => (
          <EnrollmentCard
            key={`enrollment-${enrollment.id}`}
            enrollment={enrollment}
            buttonType={'leave-sub'}
          />
        ))}
      </div>
    </div>
  )

}