'use client';

import {useCallback, useEffect, useMemo, useState} from "react";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import {convertWeekdayToNumber} from "@/libs/weekday";
import {usePathname, useRouter} from "@/i18n/navigation";

type Input = {
  area: string[]; // changed to array for multi-select
  level: string[];
  age: string[];
  day: string[];
  code: string;
}

type IProps = {
  initialValues?: Partial<Input> | { area?: string; level?: string; age?: string; day?: string; code?: string } ; // keys may come as CSV string from query
}

export default function CourseFilterButton(props: IProps) {

  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const { control, setValue, handleSubmit, watch } = useForm<Input>();

  // Watch all form values to check if any filter is active
  const formValues = watch();

  const hasActiveFilters = useMemo(() => {
    const { area, level, age, day, code } = formValues;
    return (
      (area && area.length > 0) ||
      (level && level.length > 0) ||
      (age && age.length > 0) ||
      (day && day.length > 0) ||
      (code && code.trim().length > 0)
    );
  }, [formValues]);

  const applyFilter = useCallback((data: Input) => {
    const sp = new URLSearchParams(window.location.search);
    if (data.area && data.area.length) {
      sp.set('area', data.area.join(','));
    } else {
      sp.delete('area');
    }
    if (data.level && data.level.length) {
      sp.set('level', data.level.join(','));
    } else {
      sp.delete('level');
    }
    if (data.age && data.age.length) {
      sp.set('age', data.age.join(','));
    } else {
      sp.delete('age');
    }
    if (data.day && data.day.length) {
      sp.set('day', data.day.join(','));
    } else {
      sp.delete('day');
    }
    if (data.code) {
      sp.set('code', data.code);
    } else {
      sp.delete('code');
    }
    const queryString = sp.toString();
    const newUrl = `${pathname}${queryString ? `?${queryString}` : ''}`;
    router.replace(newUrl);
    setIsOpen(false);
  }, [pathname, router]);

  const clearAllFilters = useCallback(() => {
    setValue('area', []);
    setValue('level', []);
    setValue('age', []);
    setValue('day', []);
    setValue('code', '');
    router.replace(pathname);
    setIsOpen(false);
  }, [pathname, router, setValue]);

  useEffect(() => {
    if (props.initialValues) {
      Object.entries(props.initialValues).forEach(([key, value]) => {
        if (value) {
          if (key === 'area') {
            // support comma-separated string from query or an array
            if (typeof value === 'string') {
              setValue('area', value.split(',').filter(v => v));
            } else if (Array.isArray(value)) {
              setValue('area', value as string[]);
            } else {
              // unknown shape, ignore
            }
          } else if (key === 'level') {
            if (typeof value === 'string') {
              setValue('level', value.split(',').filter(v => v));
            } else if (Array.isArray(value)) {
              setValue('level', value as string[]);
            }
          } else if (key === 'age') {
            if (typeof value === 'string') {
              setValue('age', value.split(',').filter(v => v));
            } else if (Array.isArray(value)) {
              setValue('age', value as string[]);
            }
          } else if (key === 'day') {
            if (typeof value === 'string') {
              setValue('day', value.split(',').filter(v => v));
            } else if (Array.isArray(value)) {
              setValue('day', value as string[]);
            }
          } else if (key === 'code') {
            if (typeof value === 'string') {
              setValue('code', value);
            }
          }
        }
      });
    }
  }, [props.initialValues, setValue]);

  return (
    <>
      <a onClick={() => setIsOpen(true)} className="cursor-pointer relative">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.6187 4.64346C21.5033 4.37675 21.312 4.14986 21.0686 3.99101C20.8253 3.83216 20.5406 3.74836 20.25 3.75002H3.74997C3.45966 3.7506 3.17575 3.8354 2.93269 3.99416C2.68962 4.15291 2.49785 4.37879 2.38063 4.64438C2.26341 4.90998 2.22579 5.20389 2.27232 5.49045C2.31886 5.77701 2.44755 6.04391 2.64279 6.25877L2.65029 6.26721L8.99998 13.0472V20.25C8.99991 20.5215 9.07353 20.7879 9.21297 21.0208C9.35241 21.2538 9.55246 21.4445 9.79178 21.5727C10.0311 21.7008 10.3007 21.7617 10.5719 21.7487C10.843 21.7356 11.1056 21.6493 11.3315 21.4988L14.3315 19.4981C14.5372 19.3612 14.7058 19.1755 14.8224 18.9576C14.939 18.7398 15 18.4965 15 18.2494V13.0472L21.3506 6.26721L21.3581 6.25877C21.5554 6.04489 21.6853 5.77764 21.7317 5.49037C21.778 5.2031 21.7387 4.90854 21.6187 4.64346ZM13.9068 12.0263C13.6463 12.3024 13.5008 12.6675 13.5 13.0472V18.2494L10.5 20.25V13.0472C10.5008 12.6662 10.3559 12.2992 10.095 12.0216L3.74997 5.25002H20.25L13.9068 12.0263Z" fill="#283237"/>
        </svg>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        )}
      </a>

      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen bg-black/10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white py-6 px-4 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle as="h3" className="text-lg text-center font-medium">
                {t('CourseFilterButton.title')}
              </DialogTitle>
              <form onSubmit={handleSubmit(applyFilter)}>
                <div className="space-y-4">
                  <div className="mt-4">
                    <h2 className="font-medium">{t('CourseFilterButton.code')}</h2>
                    <Controller
                      control={control}
                      render={({field}) => (
                        <input
                          {...field}
                          type="text"
                          placeholder={t('CourseFilterButton.code-placeholder')}
                          className="mt-2 w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                      )}
                      name="code"
                    />
                  </div>
                  <div className="mt-4">
                    <h2 className="font-medium">{t('CourseFilterButton.area')}</h2>
                    <Controller
                      control={control}
                      render={({field: {onChange, value}}) => (
                        <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                          {[
                            {
                              label: 'hong-kong', value: '香港島'
                            }, {
                              label: 'kowloon', value: '九龍'
                            }, {
                              label: 'new-territories', value: '新界'
                            }
                          ].map(item => {
                            const selected = Array.isArray(value) && value.includes(item.value);
                            return (
                              <a
                                key={item.label}
                                onClick={() => {
                                  const current = Array.isArray(value) ? value.slice() : [];
                                  const idx = current.indexOf(item.value);
                                  if (idx > -1) {
                                    current.splice(idx, 1);
                                  } else {
                                    current.push(item.value);
                                  }
                                  onChange(current);
                                }}
                                className={`${selected ? 'bg-primary text-white font-medium' : 'bg-brand-netural-100'} text-center rounded-md py-2`}
                              >
                                {t(`Area.${item.label}`)}
                              </a>
                            )
                          })}
                        </div>
                      )}
                      name="area"
                    />
                  </div>
                  <div className="mt-4">
                    <h2 className="font-medium">{t('CourseFilterButton.level')}</h2>
                    <Controller
                      control={control}
                      render={({field: {onChange, value}}) => (
                        <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                          {[
                            {
                              label: '新手初階', value: '新手、初階'
                            },
                            {
                              label: '初階', value: '初階'
                            }, {
                              label: '中階', value: '中階'
                            }, {
                              label: '進階', value: '進階'
                            }
                          ].map(item => {
                            const selected = Array.isArray(value) && value.includes(item.value);
                            return (
                              <a
                                key={item.label}
                                onClick={() => {
                                  const current = Array.isArray(value) ? value.slice() : [];
                                  const idx = current.indexOf(item.value);
                                  if (idx > -1) {
                                    current.splice(idx, 1);
                                  } else {
                                    current.push(item.value);
                                  }
                                  onChange(current);
                                }}
                                className={`${selected ? 'bg-primary text-white font-medium' : 'bg-brand-netural-100'} text-center rounded-md py-2`}
                              >
                                {item.label}
                              </a>
                            )
                          })}
                        </div>
                      )}
                      name="level"
                    />
                  </div>
                  <div className="mt-4">
                    <h2 className="font-medium">{t('CourseFilterButton.age')}</h2>
                    <Controller
                      control={control}
                      render={({field: {onChange, value}}) => (
                        <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                          {[
                            {
                              label: 'U6', value: 'U6'
                            },
                            {
                              label: 'U8', value: 'U8'
                            },
                            {
                              label: 'U10', value: 'U10'
                            },
                            {
                              label: 'U12', value: 'U12'
                            },
                            {
                              label: 'U14', value: 'U14'
                            },
                            {
                              label: 'U15', value: 'U15'
                            },
                            {
                              label: 'U16', value: 'U16'
                            },
                            {
                              label: '成人', value: '成人'
                            }
                          ].map(item => {
                            const selected = Array.isArray(value) && value.includes(item.value);
                            return (
                              <a
                                key={item.label}
                                onClick={() => {
                                  const current = Array.isArray(value) ? value.slice() : [];
                                  const idx = current.indexOf(item.value);
                                  if (idx > -1) {
                                    current.splice(idx, 1);
                                  } else {
                                    current.push(item.value);
                                  }
                                  onChange(current);
                                }}
                                className={`${selected ? 'bg-primary text-white font-medium' : 'bg-brand-netural-100'} text-center rounded-md py-2`}
                              >
                                {item.label}
                              </a>
                            )
                          })}
                        </div>
                      )}
                      name="age"
                    />
                  </div>
                  <div className="mt-4">
                    <h2 className="font-medium">{t('CourseFilterButton.day')}</h2>
                    <Controller
                      control={control}
                      render={({field: {onChange, value}}) => (
                        <div className="grid grid-cols-7 gap-2 mt-2 text-xs">
                          {[...Array(7).keys()].map(item => {
                            const val = item.toString();
                            const selected = Array.isArray(value) && value.includes(val);
                            return (
                              <a
                                key={`day-${item}`}
                                onClick={() => {
                                  const current = Array.isArray(value) ? value.slice() : [];
                                  const idx = current.indexOf(val);
                                  if (idx > -1) {
                                    current.splice(idx, 1);
                                  } else {
                                    current.push(val);
                                  }
                                  onChange(current);
                                }}
                                className={`${selected ? 'bg-primary text-white font-medium' : 'bg-brand-netural-100'} text-center rounded-md py-2`}
                              >
                                {convertWeekdayToNumber(item)}
                              </a>
                            )
                          })}
                        </div>
                      )}
                      name="day"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    disabled={!hasActiveFilters}
                    className="flex-1 py-2 px-4 rounded-xl border border-brand-neutral-200 text-brand-neutral-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-neutral-50"
                  >
                    {t('CourseFilterButton.clear-all')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-xl shadow-md font-medium transition-colors hover:bg-primary/90"
                  >
                    {t('CourseFilterButton.apply-filter')}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )

}