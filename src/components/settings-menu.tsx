'use client';

import { useTranslations } from "next-intl";
import { ChevronRight, CircleQuestionMark, Globe, LogOut, User, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Card from "@/components/card";
import { useState } from "react";

export default function SettingsMenu() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-brand-neutral-100 rounded-full transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-sm sm:rounded-[20px] rounded-t-[20px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-4 py-4 border-b border-brand-neutral-200 flex justify-between items-center">
              <h1 className="font-semibold text-lg">{t('Settings.title')}</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-brand-neutral-100 rounded-full transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/*<Link href="/" className="block" onClick={() => setIsOpen(false)}>*/}
              {/*  <Card className="flex gap-3 items-center">*/}
              {/*    <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">*/}
              {/*      <Globe className="w-[24px] h-[24px] text-primary-500"/>*/}
              {/*    </div>*/}
              {/*    <div className="">{t('Settings.language')}</div>*/}
              {/*    <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />*/}
              {/*  </Card>*/}
              {/*</Link>*/}

              {/*<Link href="/" className="block" onClick={() => setIsOpen(false)}>*/}
              {/*  <Card className="flex gap-3 items-center">*/}
              {/*    <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">*/}
              {/*      <CircleQuestionMark className="w-[24px] h-[24px] text-primary-500"/>*/}
              {/*    </div>*/}
              {/*    <div className="">{t('Settings.about')}</div>*/}
              {/*    <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />*/}
              {/*  </Card>*/}
              {/*</Link>*/}

              <Link href="/auth/logout" className="block" onClick={() => setIsOpen(false)}>
                <Card className="flex gap-3 items-center">
                  <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-100 rounded-full">
                    <LogOut className="w-[24px] h-[24px] text-brand-500"/>
                  </div>
                  <div className="">{t('Settings.logout')}</div>
                  <ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />
                </Card>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
