'use server';

import {CourseDto} from "@/types/courseDto";
import {fetcher} from "@/libs/fetcher";
import {EnrollmentDto, EnrollmentWithCountDto} from "@/types/enrollment";
import {ApplicationInput} from "@/components/enrollment-leave-application";
import {LessonDto} from "@/types/lessonDto";
import {InvoiceDto, InvoiceItemDto} from "@/types/invoiceDto";

export const getCourses = async (query?: {
  level?: string | string[];
  area?: string | string[];
  age?: string | string[];
  day?: string | string[];
  category?: string;
}) => {
  const sp = new URLSearchParams();
  if (query) {
    if (query.category) {
      sp.append('category', query.category);
    }
    if (query.level) {
      if (Array.isArray(query.level)) {
        sp.append('level', query.level.join(','));
      } else {
        sp.append('level', query.level);
      }
    }
    if (query.area) {
      if (Array.isArray(query.area)) {
        sp.append('area', query.area.join(','));
      } else {
        sp.append('area', query.area);
      }
    }
    if (query.age) {
      if (Array.isArray(query.age)) {
        sp.append('age', query.age.join(','));
      } else {
        sp.append('age', query.age);
      }
    }
    if (query.day) {
      if (Array.isArray(query.day)) {
        sp.append('day', query.day.join(','));
      } else {
        sp.append('day', query.day);
      }
    }
  }
  const res = await fetcher('GET', `/app/course?${sp.toString()}`);
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

export const getCourseEnrollmentStatus = async (id: number) => {
  const res = await fetcher('GET', `/app/enrollment/course/${id}/status`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as { canEnroll: boolean };
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
  return await res.json() as { course: CourseDto; invoiceItem: InvoiceItemDto }[];
}

export const getEnrolledCourse = async (id: number) => {
  const res = await fetcher('GET', `/app/enrollment/course/${id}`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as CourseDto;
}

export const getEnrollmentDeductible = async () => {
  const res = await fetcher('GET', `/app/enrollment/deductible`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as EnrollmentDto[];
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
  return await res.json() as EnrollmentDto;
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

export const enrollCourse = async (courseId: number, holidays: string[], isRenewal: boolean) => {
  const res = await fetcher('POST', `/app/course/${courseId}/enroll`, { holidays, isRenewal });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json() as InvoiceDto;
}