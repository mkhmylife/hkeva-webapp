'use client';

import {useCallback, useState} from "react";
import {useTranslations} from "next-intl";
import {User} from "lucide-react";
import {loginWithStudentToken} from "@/libs/auth";

type Student = {
  id: number;
  name: string;
  accessToken: string;
  code: string;
}

type IProps = {
  currentUserId: number;
  students: Student[];
}

export default function StudentSwitcher({currentUserId, students}: IProps) {

  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onSelectStudent = useCallback(async (student: Student) => {
    if (student.id === currentUserId) return;

    setIsLoading(true);
    try {
      await loginWithStudentToken(student.accessToken);
      window.location.reload();
    } catch (e) {
      alert(t('Login.failed-to-login'));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
    setIsDropdownOpen(false);
  }, [currentUserId, t]);

  if (students.length <= 1) {
    return null;
  }

  const currentStudent = students.find(s => s.id === currentUserId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 bg-brand-neutral-100 hover:bg-brand-neutral-200 transition-colors rounded-full py-1.5 px-3 pr-2 disabled:opacity-50"
      >
        <User className="w-4 h-4 text-brand-neutral-600"/>
        <span className="text-sm font-medium text-brand-neutral-700">
          {currentStudent?.name || t('Profile.select-student')}
        </span>
        <svg
          className={`w-4 h-4 text-brand-neutral-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-xl shadow-lg border border-brand-neutral-100 py-1 min-w-[200px]">
            {students.map(student => (
              <button
                key={student.id}
                onClick={() => onSelectStudent(student)}
                disabled={isLoading}
                className={`w-full text-left px-4 py-2.5 transition-colors flex items-center gap-3 ${
                  student.id === currentUserId
                    ? 'bg-brand-neutral-50 text-brand-neutral-400 cursor-default'
                    : 'hover:bg-brand-neutral-50 text-brand-neutral-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{student.name}</p>
                  <p className="text-xs text-brand-neutral-500">{student.code}</p>
                </div>
                {student.id === currentUserId && (
                  <svg className="w-4 h-4 text-brand-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
