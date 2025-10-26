'use client';

import {Bell, House, Newspaper, User, Volleyball} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";


export default function Footer() {

  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full container mx-auto max-w-lg py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <footer className="bg-primary-900 rounded-full w-full flex items-center justify-between text-white p-1">
        <Link href="/" className={`${pathname === "/" ? 'bg-white text-primary-900' : ''} cursor-pointer rounded-full hover:bg-white hover:text-primary-900 transition-colors h-[56px] w-[56px] flex items-center justify-center`}>
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