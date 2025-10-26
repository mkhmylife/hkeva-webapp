import {logout} from "@/libs/auth";
import {redirect} from "@/i18n/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  await logout();
  return redirect({
    href: '/auth/login',
    locale,
  });
}