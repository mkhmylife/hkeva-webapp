'use client';

import BackButton from "@/components/back-button";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import {useCallback, useState} from "react";
import InputField from "@/components/Form/InputField";
import Card from "@/components/card";
import ImageUploading, {ImageListType} from 'react-images-uploading';
import {Images} from "lucide-react";
import {applyEnrollmentLeave} from "@/libs/course";
import {EnrollmentDto, EnrollmentWithCountDto} from "@/types/enrollment";
import {useRouter} from "next/navigation";

export type ApplicationInput = {
  type?: 'sick' | 'exam' | 'school-activity' | 'travel' | 'other';
  reason?: string;
  proofPhotoUrls?: ImageListType & { assetUrl: string };
}

type Props = {
  enrollment: EnrollmentWithCountDto;
}

export default function EnrollmentLeaveApplication(props: Props) {

  const t = useTranslations();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { register, control, handleSubmit, setValue, watch } = useForm<ApplicationInput>();
  const activeType = watch('type');

  const toggleType = useCallback((type: ApplicationInput['type']) => {
    if (activeType === type) {
      setValue('type', undefined);
    } else {
      setValue('type', type);
    }
  }, [activeType, setValue]);

  const submitHandler = useCallback(async (data: ApplicationInput) => {
    if (isLoading) {
      return;
    }
    if (!data.type) {
      alert(t('EnrollmentLeaveApplication.please-select-leave-type'));
      return;
    }
    if (data.type === 'other' && !data.reason) {
      alert(t('EnrollmentLeaveApplication.please-enter-reason'));
      return;
    }
    if (['exam', 'school-activity', 'travel'].includes(data.type) && (!data.proofPhotoUrls || data.proofPhotoUrls.length === 0)) {
      alert(t('EnrollmentLeaveApplication.please-upload-proof'));
      return;
    }
    setIsLoading(true);
    try {
      await applyEnrollmentLeave(props.enrollment.id, data);
      alert(t('EnrollmentLeaveApplication.apply-success'));
      router.replace(`/enrollment/${props.enrollment.id}/leave/success`);
    } catch (e) {
      alert(t('EnrollmentLeaveApplication.apply-failed'));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, props.enrollment.id, router, t]);

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mb-2 flex gap-3 items-baseline">
        <h1 className="font-semibold text-lg">{t('Enrollment.leave-title')}</h1>
        <p className="text-xs text-brand-neutral-500">{t('Enrollment.applied-leave-x-time', {x: props.enrollment.enrollmentHolidaysCount})}</p>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <a
            onClick={() => toggleType('sick')}
            className={`${activeType === 'sick' ? 'bg-primary text-white' : 'bg-white'} cursor-pointer transition-colors shadow-md rounded-xl py-2 block text-center font-medium`}
          >
            {t('Enrollment.leave-type.sick')}
          </a>
          <a
            onClick={() => toggleType('other')}
            className={`${activeType === 'other' ? 'bg-primary text-white' : 'bg-white'} cursor-pointer transition-colors shadow-md rounded-xl py-2 block text-center font-medium`}
          >
            {t('Enrollment.leave-type.other')}
          </a>
        </div>
        {activeType === 'other' ? (
          <div>
            <InputField textInputProps={{...register('reason')} }/>
          </div>
        ) : null}
        <div className="grid grid-cols-3 gap-2">
          <a
            onClick={() => toggleType('exam')}
            className={`${activeType === 'exam' ? 'bg-primary text-white' : 'bg-white'} cursor-pointer transition-colors shadow-md rounded-xl py-2 block text-center font-medium`}
          >
            {t('Enrollment.leave-type.exam')}
          </a>
          <a
            onClick={() => toggleType('school-activity')}
            className={`${activeType === 'school-activity' ? 'bg-primary text-white' : 'bg-white'} cursor-pointer transition-colors shadow-md rounded-xl py-2 block text-center font-medium`}
          >
            {t('Enrollment.leave-type.school-activity')}
          </a>
          <a
            onClick={() => toggleType('travel')}
            className={`${activeType === 'travel' ? 'bg-primary text-white' : 'bg-white'} cursor-pointer transition-colors shadow-md rounded-xl py-2 block text-center font-medium`}
          >
            {t('Enrollment.leave-type.travel')}
          </a>
        </div>
        {activeType && ['exam', 'school-activity', 'travel'].includes(activeType) ? (
          <Card className="p-4">
            <div className="font-semibold text-center mb-3">{t('EnrollmentLeaveApplication.upload-proof')}</div>
            <Controller
              control={control}
              name="proofPhotoUrls"
              render={({
                         field: {onChange, name, value},
                         fieldState: {invalid, isDirty}, //optional
                         formState: {errors}, //optional, but necessary if you want to show an error message
                       }) => (
                <>
                  <ImageUploading
                    value={value ? value : []}
                    onChange={onChange}
                    maxNumber={2}
                    dataURLKey="dataUrl"
                    maxFileSize={2097152 * 5} //10mb
                    onError={error => error ? alert(error.maxNumber ? '你最多可上傳2張10mb以內的相片' : error.maxFileSize ? '每張相片最大只可10mb' : '未知錯誤') : null}
                  >
                    {({
                        imageList,
                        onImageUpload,
                        onImageRemoveAll,
                        onImageUpdate,
                        onImageRemove,
                        isDragging,
                        dragProps,
                      }) => (
                      <div className="">
                        {imageList.length == 0 ? (
                          <div
                            style={isDragging ? {color: 'red'} : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                            className="cursor-pointer flex justify-center items-center flex-col gap-5 text-xs text-center py-5 w-full bg-background block rounded-xl placeholder:text-gray-400 focus:ring-0"
                          >
                            <Images className="text-primary size-12" />
                            <div className="px-4 w-full">
                              <a
                                className="bg-primary text-white font-medium block rounded-xl text-[16px] py-2.5">{t('EnrollmentLeaveApplication.upload')}</a>
                            </div>
                          </div>
                        ) : null}

                        <div className="grid grid-cols-1 gap-2">
                          {imageList.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image['dataUrl'] || `${process.env.NEXT_PUBLIC_CDN_URL}/shops/images/${image['assetUrl']}`}
                                alt="" className="w-full rounded-md overflow-hidden object-cover"/>
                              <a
                                className="cursor-pointer absolute bottom-2 right-2 bg-white rounded-md px-1 py-0.5 text-right text-red-500 text-xs"
                                onClick={() => onImageRemove(index)}>
                                {t('EnrollmentLeaveApplication.remove')}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </ImageUploading>
                </>
              )}
            />
          </Card>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-2">
          <BackButton className="bg-primary-100 rounded-xl py-2 block text-center font-medium">
            {t('Enrollment.back')}
          </BackButton>
          <button disabled={!activeType || isLoading} type="submit" className={`${!activeType ? 'opacity-60' : ''} bg-primary text-white rounded-xl py-2 block text-center font-medium`}>
            {t('Enrollment.confirm')}
          </button>
        </div>
      </div>
    </form>
  )

}