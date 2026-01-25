import {logout} from "@/libs/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  // The logout() function handles the redirect internally
  await logout();
}