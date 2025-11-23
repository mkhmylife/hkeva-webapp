"use client";

import React, {useRef, useState} from 'react';
import Card from './card';
import {Camera} from 'lucide-react';
import {updateProfilePic} from "@/libs/user";
import {useTranslations} from "next-intl";

type Props = {
  className?: string;
  label?: string;
}

export default function ProfilePicUploader({className, label}: Props) {

  const t = useTranslations();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    inputRef.current?.click();
  }

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string | ArrayBuffer | null;
      if (!result) return;
      // result is like data:<mime>;base64,xxxx
      let base64: string;
      if (typeof result === 'string' && result.startsWith('data:')) {
        base64 = result.split(',')[1];
      } else if (typeof result === 'string') {
        base64 = btoa(result);
      } else {
        // ArrayBuffer
        const arr = new Uint8Array(result as ArrayBuffer);
        let str = '';
        for (let i = 0; i < arr.length; i++) {
          str += String.fromCharCode(arr[i]);
        }
        base64 = btoa(str);
      }

      try {
        setUploading(true);
        const payload = {
          filename: file.name,
          contentType: file.type,
          data: base64
        };
        await updateProfilePic(payload);
        window.location.reload();
      } catch (err: unknown) {
        let message = 'Upload failed';
        if (err instanceof Error) message = err.message;
        setError(message);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <Card className={`${className ?? ''} cursor-pointer`}>
        <div onClick={onClick} className="flex gap-3 items-center w-full">
          <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full overflow-hidden">
            <Camera className="w-[24px] h-[24px] text-primary-500" />
          </div>
          <div className="flex-1">{uploading ? t('Profile.uploading-pic') : (label ?? 'Upload profile pic')}</div>
        </div>
        {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
      </Card>
    </>
  );
}
