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
import {EnrollmentWithCountDto, LessonEnrollmentStatus} from "@/types/enrollment";
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
      const enrollment = await applyEnrollmentLeave(props.enrollment.id, data);
      router.replace(`/enrollment/${props.enrollment.id}/leave/success`);
    } catch (e) {
      alert(t('EnrollmentLeaveApplication.apply-failed'));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, props.enrollment.id, router, t]);

  if (props.enrollment.status === LessonEnrollmentStatus.Holiday) {
    return (
      <div className="text-center py-8 text-brand-neutral-500">
        {t('EnrollmentLeaveApplication.already-applied')}
      </div>
    );
  }

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
        {activeType && ['sick', 'exam', 'school-activity', 'travel'].includes(activeType) ? (
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
          <button disabled={!activeType || isLoading} type="submit" className={`${!activeType || isLoading ? 'opacity-60' : ''} bg-primary text-white rounded-xl py-2 flex items-center justify-center gap-2 font-medium`}>
            {isLoading ? (
              <>
                <svg aria-hidden="true" className="w-4 h-4 animate-spin text-white/30 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                {t('Enrollment.confirm')}
              </>
            ) : t('Enrollment.confirm')}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white/50 fixed inset-0 flex justify-center items-center z-50">
          <div className="flex justify-center py-16">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-brand" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
        </div>
      ) : null}
    </form>
  )

}