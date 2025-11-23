'use client';

import {useCallback, useEffect, useState} from "react";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import {convertWeekdayToNumber} from "@/libs/weekday";
import {usePathname, useRouter} from "@/i18n/navigation";

type Input = {
  area: string;
  level: string;
  age: string;
  day: string;
}

type IProps = {
  initialValues?: Partial<Input>;
}

export default function CourseFilterButton(props: IProps) {

  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const { control, setValue, handleSubmit } = useForm<Input>();

  const applyFilter = useCallback((data: Input) => {
    const sp = new URLSearchParams(window.location.search);
    if (data.area) {
      sp.set('area', data.area);
    } else {
      sp.delete('area');
    }
    if (data.level) {
      sp.set('level', data.level);
    } else {
      sp.delete('level');
    }
    if (data.age) {
      sp.set('age', data.age);
    } else {
      sp.delete('age');
    }
    if (data.day) {
      sp.set('day', data.day);
    } else {
      sp.delete('day');
    }
    const queryString = sp.toString();
    const newUrl = `${pathname}${queryString ? `?${queryString}` : ''}`;
    router.replace(newUrl);
    setIsOpen(false);
  }, [pathname, router]);

  useEffect(() => {
    if (props.initialValues) {
      console.log(11);
      Object.entries(props.initialValues).forEach(([key, value]) => {
        if (value) {
          setValue(key as keyof Input, value);
        }
      });
    }
  }, [props.initialValues, setValue]);

  return (
    <>
      <a onClick={() => setIsOpen(true)} className="cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.6187 4.64346C21.5033 4.37675 21.312 4.14986 21.0686 3.99101C20.8253 3.83216 20.5406 3.74836 20.25 3.75002H3.74997C3.45966 3.7506 3.17575 3.8354 2.93269 3.99416C2.68962 4.15291 2.49785 4.37879 2.38063 4.64438C2.26341 4.90998 2.22579 5.20389 2.27232 5.49045C2.31886 5.77701 2.44755 6.04391 2.64279 6.25877L2.65029 6.26721L8.99998 13.0472V20.25C8.99991 20.5215 9.07353 20.7879 9.21297 21.0208C9.35241 21.2538 9.55246 21.4445 9.79178 21.5727C10.0311 21.7008 10.3007 21.7617 10.5719 21.7487C10.843 21.7356 11.1056 21.6493 11.3315 21.4988L14.3315 19.4981C14.5372 19.3612 14.7058 19.1755 14.8224 18.9576C14.939 18.7398 15 18.4965 15 18.2494V13.0472L21.3506 6.26721L21.3581 6.25877C21.5554 6.04489 21.6853 5.77764 21.7317 5.49037C21.778 5.2031 21.7387 4.90854 21.6187 4.64346ZM13.9068 12.0263C13.6463 12.3024 13.5008 12.6675 13.5 13.0472V18.2494L10.5 20.25V13.0472C10.5008 12.6662 10.3559 12.2992 10.095 12.0216L3.74997 5.25002H20.25L13.9068 12.0263Z" fill="#283237"/>
        </svg>
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
                            return (
                              <a
                                key={item.label}
                                onClick={() => value === item.value ? onChange(null) : onChange(item.value)}
                                className={`${value === item.value ? 'bg-primary text-white font-medium' : 'bg-brand-netural-100'} text-center rounded-md py-2`}
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
                              label: '高階', value: '高階'
                            }
                          ].map(item => {
                            return (
                              <a
                                key={item.label}
                                onClick={() => value === item.value ? onChange(null) : onChange(item.value)}
                                className={`${value === item.value ? 'bg-primary text-white font-medium' : 'bg-brand-netural-100'} text-center rounded-md py-2`}
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
                            }, {
                              label: 'U15', value: 'U15'
                            }, {
                              label: '成人', value: 'adult'
                            }
                          ].map(item => {
                            return (
                              <a
                                key={item.label}
                                onClick={() => value === item.value ? onChange(null) : onChange(item.value)}
                                className={`${value === item.value ? 'bg-primary text-white font-medium' : 'bg-brand-netural-100'} text-center rounded-md py-2`}
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
                            return (
                              <a
                                key={`day-${item}`}
                                onClick={() => value === item.toString() ? onChange(null) : onChange(item.toString())}
                                className={`${value === item.toString() ? 'bg-primary text-white font-medium' : 'bg-brand-netural-100'} text-center rounded-md py-2`}
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
                <button type="submit" className="bg-primary text-white w-full mt-6 cursor-pointer transition-colors shadow-md rounded-xl py-2 block text-center font-medium">
                  {t('CourseFilterButton.apply-filter')}
                </button>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )

}