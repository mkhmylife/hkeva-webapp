import {CourseDto} from "@/types/courseDto";
import {RoomDto} from "@/types/roomDto";
import {EnrollmentDto} from "@/types/enrollment";

export interface LessonDto {
  id: number;
  branchId: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  startTimeInDate: string;
  endTimeInDate: string;
  primaryTeacherId?: number;
  assistantTeacherIds?: number[];
  roomId: number;
  room?: RoomDto;
  pplLimit: number;
  enrollmentCount?: number;
  attendedCount?: number;
  isEnrolled?: boolean;
  course?: CourseDto;
  cancelledAt?: string;
  cancelReason?: string;
  replacementLessonId?: number;
  enrollments?: EnrollmentDto[];
}