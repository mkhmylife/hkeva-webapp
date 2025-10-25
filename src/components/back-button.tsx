'use client';

import React, {useCallback} from "react";
import {useRouter} from "@/i18n/navigation";
import {ChevronLeft} from "lucide-react";

interface IProps {
  absolute?: boolean;
  className?: string;
  children?: React.ReactNode; // added children prop
}

const BackButton = ({ absolute, className = "", children }: IProps) => {

  const router = useRouter();

  const back = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      {children ? (
        <a
          onClick={() => back()}
          className={className}
        >
          {children}
        </a>
      ) : (
        <a
          onClick={() => back()}
          className={`
          rounded-full w-[34px] h-[34px] flex items-center justify-center bg-black/50 hover:bg-gray-100 shadow cursor-pointer block
          ${absolute ? "absolute z-10" : ""}
          ${className}
        `}
        >
          <ChevronLeft className="text-white size-6" strokeWidth={1.2} />
        </a>
      )}
    </>
  );
};

export default BackButton;