import Card from "@/components/card";
import {Calendar, CircleDollarSign, Map, Volleyball} from "lucide-react";
import {useTranslations} from "next-intl";
import moment from "moment";

type Props = {
  type: 'lesson-alert' | 'lesson-time-change' | 'lesson-location-change' | 'renew-class-payment' | 'announcement';
  title: string;
  description: string;
  createdAt: string;
  isRead?: boolean;
}

export default function NotificationCard(props: Props) {

  const t = useTranslations();

  const renderIcon = () => {
    switch (props.type) {
      case 'lesson-alert':
      case 'announcement':
        return <Volleyball className="w-[24px] h-[24px] text-primary-500"/>;
      case 'lesson-time-change':
        return <Calendar className="w-[24px] h-[24px] text-primary-500"/>;
      case 'lesson-location-change':
        return <Map className="w-[24px] h-[24px] text-primary-500"/>;
      case 'renew-class-payment':
        return <CircleDollarSign className="w-[24px] h-[24px] text-primary-500"/>;
    }
  }

  return (
    <Card className="flex gap-3 items-center">
      <div className="relative w-[40px] h-[40px] aspect-square flex items-center justify-center bg-brand-netural-100 rounded-full">
        {renderIcon()}
        {!props.isRead ? (
          <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"/ >
        ) : null}
      </div>
      <div className="w-[calc(100%-40px)]">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold">{props.title}</h2>
          <p className="text-xs text-brand-neutral-500">{moment(props.createdAt).format('YYYY-MM-DD')}</p>
        </div>
        <p className="mt-0.5 leading-[1.2] line-clamp-2" dangerouslySetInnerHTML={{ __html: props.description.replaceAll("\n", "<br />") }} />
      </div>
    </Card>
  )
}