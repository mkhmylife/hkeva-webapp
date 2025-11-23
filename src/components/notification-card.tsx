import Card from "@/components/card";
import {Calendar, CircleDollarSign, Map, Volleyball} from "lucide-react";
import {useTranslations} from "next-intl";
import moment from "moment";
import {UserNotificationDto} from "@/types/notificationDto";

type Props = {
  notification: UserNotificationDto;
}

export default function NotificationCard(props: Props) {

  const t = useTranslations();
  
  const { type, createdAt, isRead, title, message } = props.notification;

  const renderIcon = () => {
    switch (type) {
      case 'LessonCancellation':
      case 'NewCourse':
      case 'General':
        return <Volleyball className="w-[24px] h-[24px] text-primary-500"/>;
      case 'LessonTimeChange':
        return <Calendar className="w-[24px] h-[24px] text-primary-500"/>;
      case 'LessonLocationChange':
        return <Map className="w-[24px] h-[24px] text-primary-500"/>;
      case 'PaymentReminder':
        return <CircleDollarSign className="w-[24px] h-[24px] text-primary-500"/>;
    }
  }

  return (
    <Card className="flex gap-3 items-center">
      <div className="relative w-[40px] h-[40px] aspect-square flex items-center justify-center bg-brand-netural-100 rounded-full">
        {renderIcon()}
        {!isRead ? (
          <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"/ >
        ) : null}
      </div>
      <div className="w-[calc(100%-40px)]">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-brand-neutral-500">{moment(createdAt).format('YYYY-MM-DD')}</p>
        </div>
        <p className="mt-0.5 leading-[1.2] line-clamp-2" dangerouslySetInnerHTML={{ __html: message.replaceAll("\n", "<br />") }} />
      </div>
    </Card>
  )
}