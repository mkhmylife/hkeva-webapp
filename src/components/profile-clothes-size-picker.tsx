'use client';

import Card from "@/components/card";
import {Shirt} from "lucide-react";
import React, {useCallback, useEffect} from "react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {updateClothesSize} from "@/libs/user";

type Input = {
  clothesSize: string;
}

type IProps = {
  size?: string;
  onChangeAction?: (value: string) => void;
}

export default function ProfileClothesSizePicker(props: IProps) {

  const t = useTranslations();

  const { register, setValue } = useForm<Input>();

  const onChangeAction = useCallback(async (value: string) => {
    if (confirm(t('Profile.clothes-size-change-confirm', { size: value }))) {
      try {
        await updateClothesSize(value);
      } catch (e) {
        alert(e);
      }
    }
  }, [t]);

  useEffect(() => {
    if (props.size) {
      setValue('clothesSize', props.size);
    }
  }, [props.size, setValue]);

  // get the register props so we can call RHF's onChange and then our own
  const clothesField = register('clothesSize');

  return (
    <Card className="flex gap-3 items-center">
      <div className="w-[40px] h-[40px] flex items-center justify-center bg-brand-netural-100 rounded-full">
        <Shirt className="w-[24px] h-[24px] text-primary-500"/>
      </div>
      <div className="">{t('Profile.clothes-size')}</div>
      <div className="ml-auto">
        <select
          {...clothesField}
          onChange={(e) => {
            // call react-hook-form's onChange so the form state stays in sync
            clothesField.onChange?.(e as React.ChangeEvent<HTMLSelectElement>);
            const val = (e.target as HTMLSelectElement).value;
            // forward the changed value to the optional prop callback
            onChangeAction(val);
          }}
          className="appearance-none outline-0 w-[40px] h-[40px] flex text-center font-medium items-center justify-center bg-brand-netural-100 rounded-full"
        >
          <option>N/A</option>
          {["S", "M", "L", "XL", "XXl", "3XL"].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      {/*<ChevronRight strokeWidth={1.2} className="ml-auto -mr-1 text-brand-neutral-500 opacity-50 size-8" />*/}
    </Card>
  )

}