import {AdminType} from "@/types/adminType";
import {AdminRole} from "@/types/adminRole";
import {BranchDto} from "@/types/branchDto";

export interface AdminUserDto {
  id: number;
  branchId?: number;
  code: string;
  type: AdminType;
  role?: AdminRole;
  nickname: string;
  nameZh?: string;
  nameEn?: string;
  gender?: string;
  tierId?: number;
  dob?: string;
  hkid?: string;
  tel?: string;
  email?: string;
  address?: string;
  notes?: string;
  position: string;
  employedAt: string;
  isCurrentlyEmployed: boolean;
  username: string;
  canAccessBranches: number[];
  cannotPerformServiceMap: string;
}