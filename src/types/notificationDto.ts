import {CourseDto} from "@/types/courseDto";
import {LessonDto} from "@/types/lessonDto";
import {UserDto} from "@/types/userDto";

export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  userIds: number[];
  lessonIds?: number[];
  courseIds?: number[];
  createdAt: string;
  isActive: boolean;
  courses?: CourseDto[];
  lessons?: LessonDto[];
  users?: UserDto[];
  type: 'NewCourse' | 'PaymentReminder' | 'LessonTimeChange' | 'LessonCancellation' | 'LessonLocationChange' | 'General';
}

export interface UserNotificationDto extends NotificationDto {
  isRead: boolean;
}