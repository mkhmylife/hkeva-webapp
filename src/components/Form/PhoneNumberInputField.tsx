import React from "react";
import { InputFieldProps } from "./InputField";
import {defaultCountries, parseCountry, PhoneInput} from "react-international-phone";
import 'react-international-phone/style.css';

export interface PhoneInputFieldProps extends InputFieldProps {
  value: string;
  onChange: (text: string) => void;
}

export default function PhoneNumberInputField({
                                                label,
                                                isRequired,
                                                value,
                                                onChange,
                                                readOnly,
                                                className = ""
                                              }: PhoneInputFieldProps) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <div className="flex">
          <label className="text-sm font-sf-pro text-left text-brand-neutral-900">
            {label}
            {isRequired && <span className="text-red-600"> *</span>}
          </label>
        </div>
      )}
      <div className="relative">
        <PhoneInput
          defaultCountry="hk"
          countries={defaultCountries.filter((country) => {
            const { iso2 } = parseCountry(country);
            return ['hk', 'mo', 'cn'].includes(iso2);
          })}
          placeholder="請輸入電話號碼"
          value={value}
          onChange={onChange}
          className="w-full rounded-xl shadow-md overflow-hidden px-2 bg-white"
          // style={{
          //   '--PhoneInput-color--focus': '#3a334c',
          //   '--PhoneInputCountrySelectArrow-color': '#3a334c',
          //   '--PhoneInputCountrySelectArrow-color--focus': '#3a334c',
          // }}
        />
        {readOnly ? (
          <div className="absolute h-full w-full inset-0 "/>
        ) : null}
      </div>
    </div>
  );
}