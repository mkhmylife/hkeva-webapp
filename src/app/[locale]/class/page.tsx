import Card from "@/components/card";
import {ChevronRight, GitFork, Plane, Volleyball} from "lucide-react";
import {Link} from "@/i18n/navigation";
import React from "react";
import {getTranslations} from "next-intl/server";

export default async function ClassesPage() {

  const t = await getTranslations();
  // const me = await getMe();

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      {/*<div className="flex justify-between items-center">*/}
      {/*  <div />*/}
      {/*  <div className="flex items-center gap-4">*/}
      {/*    <div className="text-sm bg-primary-100 text-brand-neutral-900 py-1 px-2.5 rounded-full whitespace-pre">*/}
      {/*      {me.level}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="mt-4 space-y-4">
        <Link href="/class/courses" className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
              <Volleyball className="w-[24px] h-[24px] text-primary-500"/>
            </div>
            <div className="font-semibold">{t('Class.class')}</div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
          </Card>
        </Link>

        <Link href="/class/courses?category=海外訓練" className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
              <Plane className="w-[24px] h-[24px] text-primary-500"/>
            </div>
            <div className="font-semibold">{t('Class.overseas-training')}</div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
          </Card>
        </Link>

        <Link href="/class/courses?category=本地訓練營" className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
              <GitFork className="w-[24px] h-[24px] text-primary-500 rotate-180"/>
            </div>
            <div className="font-semibold">本地訓練營</div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
