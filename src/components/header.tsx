'use client';

import Image from "next/image";
import {Link, usePathname} from "@/i18n/navigation";
import SettingsMenu from "@/components/settings-menu";

export default function Header() {

  const pathname = usePathname();

  return (
    <div className="container mx-auto max-w-lg py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <Link href="/">
        <Image
          src="/images/logo.svg"
          alt="HKEVA Logo"
          width={207}
          height={48}
          className="h-8 w-auto"
        />
      </Link>
      {!pathname.includes('auth') ? (
        <SettingsMenu />
      ) : null }
    </div>
  )

}
