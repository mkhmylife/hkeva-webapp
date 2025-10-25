import {getMe} from "@/libs/user";
import ResetPassword from "@/components/ResetPassword/ResetPassword";

export default async function ResetPasswordPage() {

  const user = await getMe();

  return (
    <ResetPassword user={user} />
  )

}