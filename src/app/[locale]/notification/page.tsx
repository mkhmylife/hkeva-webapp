import {getTranslations} from "next-intl/server";
import NotificationCard from "@/components/notification-card";

export default async function NewsPage() {

  const t = await getTranslations();

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      <h2 className="font-semibold text-lg">{t('Notification.title')}</h2>

      <h3 className="mt-4 font-semibold">{t('Notification.today')}</h3>
      <div className="mt-2 space-y-4">
        <NotificationCard
          type={'announcement'}
          title={"新課程公告"}
          description={"好消息！我們即將開設高級排球技術課程，下月開始。立即報名以確保名額！"}
          createdAt={new Date().toISOString()}
        />
      </div>

      <h3 className="mt-4 font-semibold">{t('Notification.yesterday')}</h3>
      <div className="mt-2 space-y-4">
        <NotificationCard
          type={'renew-class-payment'}
          title={"舊生報名付款通知"}
          description={"我們收到11、12月的報名, 感謝你一直以來對HKEVA的支持，我們會繼續為大家提供最好的排球課程🏐😆  "}
          createdAt={new Date().toISOString()}
          isRead={true}
        />
      </div>

      <h3 className="mt-4 font-semibold">{t('Notification.this-week')}</h3>
      <div className="mt-2 space-y-4">
        <NotificationCard
          type={'lesson-alert'}
          title={"上堂提示通知"}
          description={"日期：23.10.2024 (星期三)\n" +
            "時間：1900-2100\n" +
            "Location：青衣體育館\n"}
          createdAt={new Date().toISOString()}
        />
        <NotificationCard
          type={'lesson-time-change'}
          title={"課堂時間變更"}
          description={`請注意課堂時間有變更，抱歉如有造成不便`}
          createdAt={new Date().toISOString()}
        />
        <NotificationCard
          type={'lesson-location-change'}
          title={"課堂地點通知"}
          description={"日期：23.10.2024 (星期三)\n" +
            "時間：1900-2100\n" +
            "Location：青衣體育館\n"}
          createdAt={new Date().toISOString()}
        />
      </div>
    </div>
  )

}