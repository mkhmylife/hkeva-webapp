import {CourseDto} from "@/types/courseDto";

export interface NewsDto {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  photoUrl?: string;
  course?: CourseDto;
  url?: string;
  createdAt: string;
  updatedAt: string;
}