'use client';

import Image from "next/image";
import AuthSegmentControl, {AuthSegmentControlProps} from "@/components/Auth/AuthSegmentControl";
import {Link} from "@/i18n/navigation";

interface IProps {
  showSegmentControl: boolean;
  active?: AuthSegmentControlProps['active'];
  backButton?: boolean;
}

export default function AuthHeader({ showSegmentControl, active, backButton = true }: IProps) {
  return (
    <div className="relative">
      {/*/!* Back Button - positioned absolutely by default *!/*/}
      {/*{(backButton || backButton === undefined) && (*/}
      {/*  <BackButton absolute={true} className="mt-3" />*/}
      {/*)}*/}

      {/* Logo Header */}
      <Link href={"/"} className="pt-4 pb-2 flex justify-center gap-2 items-start">
        <Image
          src="/images/logo.png" // Update path as needed
          alt="Bliss Logo"
          width={124.3}
          height={34}
          className="mb-3 h-6 w-auto"
        />
        {process.env.NEXT_PUBLIC_IS_BETA === "1" ? (
          <div className="bg-yellow-700 rounded text-[10px] text-white px-1 py-0.5 font-semibold relative -top-[10px]">Testing</div>
        ) : null}
      </Link>

      {/* Segment Control */}
      {showSegmentControl && active && (
        <AuthSegmentControl active={active} />
      )}
    </div>
  );
}