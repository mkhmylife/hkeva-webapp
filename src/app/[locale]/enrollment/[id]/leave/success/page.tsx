import {getEnrollment} from "@/libs/course";
import {getTranslations} from "next-intl/server";
import EnrollmentCard from "@/components/enrollment-card";
import {Check} from "lucide-react";
import {Link} from "@/i18n/navigation";
import {SwapApproveStatus} from "@/types/enrollment";

type Props = {
  params: Promise<{
    locale: string;
    id: number;
  }>;
}


export default async function EnrollmentLeaveApplySuccessPage(props: Props) {

  const { id } = await props.params;

  const enrollment = await getEnrollment(id);

  const t = await getTranslations();

  return (
    <>
      <div className="container px-4 sm:px-6 lg:px-8">
        {/*<BackButton />*/}

        <div className="pt-0">
          <div className="flex justify-center items-center">
            <div className="size-[97px] bg-primary-900 text-white rounded-full flex justify-center items-center">
              <Check className="size-[65px]" />
            </div>
          </div>
          <div className="-mt-[40px]">
            <EnrollmentCard
              enrollment={enrollment}
            />
          </div>
          <div className="flex justify-center items-center mt-5 flex-col">
            <h1 className="font-semibold text-2xl line-clamp-1">{t('EnrollmentLeaveApplication.success-title')}</h1>

            {enrollment.swapApproveStatus === SwapApproveStatus.Approved ? (
              <Link href={`/enrollment/${enrollment.id}/substitution`} className="w-full bg-primary-100 rounded-xl py-2 px-6 mt-4 block text-center font-medium">
                {t('Lesson.apply-for-substitution')}
              </Link>
            ) : null}

            <Link href={`/`} className="w-full bg-primary text-white rounded-xl py-2 px-6 mt-2 block text-center font-medium">
              {t('EnrollmentLeaveApplication.complete-button')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}