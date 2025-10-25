import React from "react";

export interface InputFieldProps {
  label?: string;
  isRequired?: boolean;
  textInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  readOnly?: boolean;
}

const InputField = ({ label, isRequired, textInputProps, className = "" }: InputFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <div className="flex">
          <label className="text-sm font-sf-pro text-left text-brand-neutral-900">
            {label}
            {isRequired && <span className="text-red-600">{" "}*</span>}
          </label>
        </div>
      )}
      <input
        className="w-full h-10 px-3 py-2 rounded-xl shadow-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-700"
        {...textInputProps}
      />
    </div>
  );
};

export default InputField;