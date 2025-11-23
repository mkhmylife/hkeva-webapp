import {UserDto} from "@/types/userDto";
import {LessonDto} from "@/types/lessonDto";
import {CourseDto} from "@/types/courseDto";
import {InvoiceItemMiniDto} from "@/types/invoiceDto";

export enum LessonEnrollmentStatus {
  Enrolled = 'Enrolled',
  Attended = 'Attended',
  Late = 'Late',
  Absent = 'Absent',
  Holiday = 'Holiday',
  Rescheduled = 'Rescheduled',
  Cancelled = 'Cancelled',
}

export enum SwapApproveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface EnrollmentDto {
  id: number;
  status: LessonEnrollmentStatus;
  notes?: string;
  user: UserDto;
  lesson: LessonDto;
  course: CourseDto;
  hasSwapped: boolean;
  swapTo?: EnrollmentDto;
  swapFrom?: EnrollmentDto;
  invoiceItem?: InvoiceItemMiniDto;
  swapApproveStatus: SwapApproveStatus;
}

export interface EnrollmentWithInvoiceItemMiniDto extends EnrollmentDto {
  invoiceItem: InvoiceItemMiniDto;
}

export interface EnrollmentWithCountDto extends EnrollmentDto {
  enrollmentCounts: number;
  enrollmentIndex: number;
  enrollmentHolidaysCount: number;
}