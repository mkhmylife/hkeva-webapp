import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function SubstitutionNotFound() {
  const t = await getTranslations('EnrollmentSubstitutionApplication');

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-lg font-semibold">{t('unavailable-title')}</h1>
      <p className="mt-3 text-brand-neutral-600">{t('unavailable-description')}</p>
      <Link href="/profile/timetable" className="mt-4 block rounded-xl bg-primary py-2 text-center font-medium text-white">
        {t('back-to-lessons')}
      </Link>
    </div>
  );
}
