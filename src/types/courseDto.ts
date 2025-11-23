import {LessonDto} from "@/types/lessonDto";
import {RoomDto} from "@/types/roomDto";
import {CategoryDto} from "@/types/categoryDto";

export interface CourseDto {
  id: number;
  branchId: number;
  code: string;
  name: string;
  description?: string;
  pricePerLesson?: number;
  pricePerCourse?: number;
  duration?: number;
  notes?: string;
  displayColor?: string;
  isActive: boolean;
  categoryId?: number;
  lessons?: LessonDto[];
  defaultRoom?: RoomDto;
  category?: CategoryDto;
  category2?: CategoryDto;
  isFixedRoom: boolean;
}

export interface MemberCourseDto extends CourseDto {
  invoices: {
    id: number;
    code: string;
    createdAt: string;
    due: number;
  }[];
}