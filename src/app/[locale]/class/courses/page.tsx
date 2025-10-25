import {useTranslations} from "next-intl";
import Card from "@/components/card";
import {ChevronRight, GitFork, Plane, Volleyball} from "lucide-react";
import {Link} from "@/i18n/navigation";
import {getTranslations} from "next-intl/server";
import {getCourses} from "@/libs/course";
import CourseCard from "@/components/course-card";

export default async function CoursesPage() {

  const t = await getTranslations();

  const courses = await getCourses();

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <h1 className="font-semibold text-lg">{t('Course.title')}</h1>

      <div className="mt-4 space-y-4">
        {courses.map((course) => (
          <Link key={course.id} href={`/class/courses/${course.id}`} className="block">
            <CourseCard course={course} />
          </Link>
        ))}

      </div>
    </div>
  );
}
