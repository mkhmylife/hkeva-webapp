'use server';

import {CourseDto} from "@/types/courseDto";
import {fetcher} from "@/libs/fetcher";
import {EnrollmentDto, EnrollmentWithCountDto, EnrollmentWithInvoiceItemMiniDto} from "@/types/enrollment";
import {ApplicationInput} from "@/components/enrollment-leave-application";
import {LessonDto} from "@/types/lessonDto";

export const getCourses = async () => {
  const res = await fetcher('GET', `/app/course`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as CourseDto[];
}

export const getCourse = async (id: number) => {
  const res = await fetcher('GET', `/app/course/${id}`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as CourseDto;
}

export const getLesson = async (id: number) => {
  const res = await fetcher('GET', `/app/lesson/${id}`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as LessonDto;
}

export const getEnrollments = async (date?: string) => {
  const sp = new URLSearchParams();
  if (date) {
    sp.append('date', date);
  }
  const res = await fetcher('GET', `/app/enrollment?${sp.toString()}`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as EnrollmentDto[];
}

export const getEnrolledCourses = async () => {
  const res = await fetcher('GET', `/app/enrollment/course`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as CourseDto[];
}

export const getEnrollmentDeductible = async () => {
  const res = await fetcher('GET', `/app/enrollment/deductible`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as { total: number; expiredAt: string };
}

export const getEnrollmentHolidays = async () => {
  const res = await fetcher('GET', `/app/enrollment/holidays`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as EnrollmentDto[];
}

export const getEnrollment = async (id: number) => {
  const res = await fetcher('GET', `/app/enrollment/${id}`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as EnrollmentWithCountDto;
}

export const getEnrollmentSwappableLessons = async (fromEnrollmentId: number) => {
  const res = await fetcher('GET', `/app/enrollment/${fromEnrollmentId}/swappable-lessons`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as LessonDto[];
}

export const applyEnrollmentLeave = async (id: number, dto: ApplicationInput) => {
  const res = await fetcher('POST', `/app/enrollment/${id}/leave`, dto);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return true;
}

export const applyEnrollmentSubstitution = async (enrollmentId: number, swapToLessonId: number) => {
  const res = await fetcher('POST', `/app/enrollment/${enrollmentId}/swap`, {
    swapToLessonId,
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as EnrollmentDto;
}