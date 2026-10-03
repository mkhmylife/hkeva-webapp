'use client';

import {Bell, House, Newspaper, User, Volleyball} from "lucide-react";
import {Link, usePathname} from "@/i18n/navigation";

type Props = {
  locale: string;
}

export default function Footer(props: Props) {

  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-[5] w-full mx-auto max-w-lg pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <footer className="bg-primary-900 rounded-full w-full flex items-center justify-between text-white p-1">
        <Link href="/" className={`${pathname === `/` ? 'bg-white text-primary-900' : ''} cursor-pointer rounded-full hover:bg-white hover:text-primary-900 transition-colors h-[56px] w-[56px] flex items-center justify-center`}>
          <House className="w-[24px] h-[24px]"/>
        </Link>
        <Link href="/news" className={`${pathname.includes("/news") ? 'bg-white text-primary-900' : ''} cursor-pointer rounded-full p-3 hover:bg-white hover:text-primary-900 transition-colors h-[56px] w-[56px] flex items-center justify-center`}>
          <Newspaper className="w-[24px] h-[24px]"/>
        </Link>
        <Link href="/class" className={`${pathname.includes("/class") ? 'bg-white text-primary-900' : ''} cursor-pointer rounded-full p-3 hover:bg-white hover:text-primary-900 transition-colors h-[56px] w-[56px] flex items-center justify-center`}>
          <Volleyball className="w-[24px] h-[24px]"/>
        </Link>
        <Link href="/notification" className={`${pathname.includes("/notification") ? 'bg-white text-primary-900' : ''} cursor-pointer rounded-full p-3 hover:bg-white hover:text-primary-900 transition-colors h-[56px] w-[56px] flex items-center justify-center`}>
          <Bell className="w-[24px] h-[24px]"/>
        </Link>
        <Link href="/profile" className={`${pathname.includes("/profile") ? 'bg-white text-primary-900' : ''} cursor-pointer rounded-full p-3 hover:bg-white hover:text-primary-900 transition-colors h-[56px] w-[56px] flex items-center justify-center`}>
          <User className="w-[24px] h-[24px]"/>
        </Link>
      </footer>
    </div>
  )

}
