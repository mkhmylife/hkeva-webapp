import {getTranslations} from "next-intl/server";
import NotificationCard from "@/components/notification-card";
import {getNotifications} from "@/libs/user";

export default async function NewsPage() {

  const t = await getTranslations();

  const notifications = await getNotifications();

  const toDayNotifications = notifications.filter(notification => {
    const createdAt = new Date(notification.createdAt);
    const today = new Date();
    return createdAt.toDateString() === today.toDateString();
  });

  const yesterdayNotifications = notifications.filter(notification => {
    const createdAt = new Date(notification.createdAt);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return createdAt.toDateString() === yesterday.toDateString();
  });

  const thisWeekNotifications = notifications.filter(notification => {
    const createdAt = new Date(notification.createdAt);
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    return createdAt >= firstDayOfWeek && createdAt < new Date(firstDayOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
  });

  const olderNotifications = notifications.filter(notification => {
    const createdAt = new Date(notification.createdAt);
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    return createdAt >= firstDayOfWeek && createdAt >= new Date(firstDayOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
  });

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-10">
      <h2 className="font-semibold text-lg">{t('Notification.title')}</h2>

      {toDayNotifications.length > 0 ? (
        <>
          <h3 className="mt-4 font-semibold">{t('Notification.today')}</h3>
          <div className="mt-2 space-y-4">
            {toDayNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </>
      ) : null}

      {yesterdayNotifications.length > 0 ? (
        <>
          <h3 className="mt-4 font-semibold">{t('Notification.yesterday')}</h3>
          <div className="mt-2 space-y-4">
            {yesterdayNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </>
      ) : null}

      {thisWeekNotifications.length > 0 ? (
        <>
          <h3 className="mt-4 font-semibold">{t('Notification.this-week')}</h3>
          <div className="mt-2 space-y-4">
            {thisWeekNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </>
      ) : null}

      {olderNotifications.length > 0 ? (
        <>
          <h3 className="mt-4 font-semibold">{t('Notification.past')}</h3>
          <div className="mt-2 space-y-4">
            {olderNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </>
      ) : null}

    </div>
  )

}