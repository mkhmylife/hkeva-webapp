import {useTranslations} from "next-intl";
import Card from "@/components/card";
import {ChevronRight, GitFork, Plane, Volleyball} from "lucide-react";
import {Link} from "@/i18n/navigation";

export default function ClassesPage() {

  const t = useTranslations();

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <h1 className="font-semibold text-lg">{t('Class.title')}</h1>

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

        <Link href="/class/courses" className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
              <GitFork className="w-[24px] h-[24px] text-primary-500 rotate-180"/>
            </div>
            <div className="font-semibold">{t('Class.completition')}</div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
          </Card>
        </Link>

        <Link href="/class/courses" className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
              <Plane className="w-[24px] h-[24px] text-primary-500"/>
            </div>
            <div className="font-semibold">{t('Class.overseas-training')}</div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
