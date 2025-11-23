import Card from "@/components/card";
import {useTranslations} from "next-intl";
import {ChevronRight, Volleyball} from "lucide-react";
import {ToDoDto} from "@/types/userDto";
import moment from "moment";
import {Link} from "@/i18n/navigation";

type IProps = {
  toDo: ToDoDto;
}

export default function ToDoCard(props: IProps) {

  const t = useTranslations();

  switch (props.toDo.type) {
    case 'course-renewal':
      return (
        <Link href={`/class/renew/step1?fromCourseId=${props.toDo.course?.id}`} className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-100 rounded-full">
              <Volleyball className="w-[24px] h-[24px] text-brand-500"/>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">恆常訓練班續報</h3>
              <p className="">{props.toDo.course?.name}即將結束，有需要續報嗎？</p>
              <p className="mt-1 text-brand-neutral-500 text-xs font-medium">需於 {moment(props.toDo.expiryDate).format('YYYY-MM-DD')} 前處理</p>
            </div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-300 opacity-20 size-8" />
          </Card>
        </Link>
      )
    case "apply-substitution":
      return (
        <Link href={`/profile/payments?type=deductible`} className="block">
          <Card className="flex gap-3 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-100 rounded-full">
              <Volleyball className="w-[24px] h-[24px] text-brand-500"/>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">請盡快安排補堂</h3>
              <p className="">{props.toDo.enrollment?.lesson?.name}有一堂需要安排補堂，請即在此安排補堂</p>
              <p className="mt-1 text-brand-neutral-500 text-xs font-medium">需於 {moment(props.toDo.expiryDate).format('YYYY-MM-DD')} 前處理</p>
            </div>
            <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-300 opacity-20 size-8" />
          </Card>
        </Link>
      )
  }
}