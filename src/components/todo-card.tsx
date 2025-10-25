import Card from "@/components/card";
import {useTranslations} from "next-intl";
import {ChevronRight, Volleyball} from "lucide-react";

export default function ToDoCard() {

  const t = useTranslations();

  return (
    <Card className="flex gap-3 items-center">
      <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-100 rounded-full">
        <Volleyball className="w-[24px] h-[24px] text-brand-500"/>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">恆常訓練班續報</h3>
        <p className="">U15 恆常訓練班即將結束，有需要續報嗎？</p>
        <p className="mt-1 text-brand-neutral-500 text-xs font-medium">需於 2024/10/30 前處理</p>
      </div>
      <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-300 opacity-20 size-8" />
    </Card>
  )

}