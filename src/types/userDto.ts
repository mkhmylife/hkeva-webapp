import {BranchDto} from "@/types/branchDto";
import {CourseDto} from "@/types/courseDto";
import {LessonDto} from "@/types/lessonDto";
import {EnrollmentDto} from "@/types/enrollment";

export interface UserDto {
  id: number;
  code: string;
  codeF: string;
  name: string;
  email: string;
  tel: string;
  telName?: string;
  telRelationship?: string;
  tel2?: string;
  tel2Name?: string;
  tel2Relationship?: string;
  tel3?: string;
  tel3Name?: string;
  tel3Relationship?: string;
  tel4?: string;
  tel4Name?: string;
  tel4Relationship?: string;
  vipLevel: string;
  gender: string;
  dob?: string;
  hkid?: string;
  notes?: string;
  area?: string;
  address?: string;
  referralSource?: string;
  referralNotes?: string;
  staffHandlerId?: number;
  isActive: boolean;
  receivePromoMessage: boolean;
  branchAccess: BranchDto[];
  registeredBranch: BranchDto;
  userTierId?: number;
  createdAt: string;
}

export interface AuthUserDto {
  id: number;
  tenantId: number;
  code: string;
  name: string;
  tel: string;
  email: string;
  level: string;
  profilePicUrl?: string;
  clothingSize?: string;
}

export interface ToDoDto {
  type: 'course-renewal' | 'apply-substitution' | 'pending-payment';
  course?: CourseDto;
  lesson?: LessonDto;
  enrollment?: EnrollmentDto;
  expiryDate: string;
}