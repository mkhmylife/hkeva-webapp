import {getEnrollment} from "@/libs/course";
import EnrollmentCard from "@/components/enrollment-card";
import {getTranslations} from "next-intl/server";
import EnrollmentLeaveApplication from "@/components/enrollment-leave-application";

type Props = {
  params: Promise<{
    locale: string;
    id: number;
  }>;
}

export default async function EnrollmentLeavePage(props: Props) {

  const { id } = await props.params;

  const enrollment = await getEnrollment(id);

  const t = await getTranslations();

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      {/*<BackButton />*/}

      <div className="pt-0">
        <EnrollmentCard
          enrollment={enrollment}
          buttonType='back'
        />
      </div>

      <div className="mt-5 mb-5">
        <EnrollmentLeaveApplication enrollment={enrollment} />
      </div>
    </div>
  );
}
