import {ServiceDto} from "@/types/serviceDto";
import {AdminUserDto} from "@/types/adminUserDto";
import {UserDto} from "@/types/userDto";
import {BranchDto} from "@/types/branchDto";
import {UserPackageDto} from "@/types/userPackageDto";
import {RoomDto} from "@/types/roomDto";
import {ServiceStatus} from "@/types/serviceStatus";
import {InvoiceItemDto} from "@/types/invoiceDto";
import {AdminType} from "@/types/adminType";
import {AdminRole} from "@/types/adminRole";

export interface RedemptionDto {
  id: number;
  code: string;
  date: Date;
  user: UserDto;
  source: 'VIP' | 'BookingSystem' | 'Bliss';
  ppl: number;
  userPackage?: UserPackageDto;
  invoiceItems?: InvoiceItemDto[];
  branch: BranchDto;
  notes: string;
  internalNotes: string;
  memberNotes?: string;
  items: {
    id: number;
    qty: number;
    ppl: number;
    deductedValue: number;
    originalPrice: number;
    service: ServiceDto;
    staff: AdminUserDto;
    isAppointedStaff: boolean;
    isAppointedRoom: boolean;
    startTime: string;
    endTime: string;
    startTimeInDate: Date;
    endTimeInDate: Date;
    notes: string;
    room: RoomDto;
    status: ServiceStatus;
  }[];
  isActive: boolean;
  updatedAt: string;
}

export interface RedemptionItemDto {
  id: number;
  qty: number;
  ppl: number;
  deductedValue: number;
  originalPrice: number;
  service: ServiceDto;
  staff: AdminUserDto;
  isAppointedRoom: boolean;
  isAppointedStaff: boolean;
  startTime: string;
  endTime: string;
  startTimeInDate: Date;
  endTimeInDate: Date;
  notes: string;
  room: RoomDto;
  status: ServiceStatus;
  redemption: {
    id: number;
    code: string;
    source: 'VIP' | 'BookingSystem' | 'Bliss';
    date: Date;
    user: UserDto;
    ppl: number;
    userPackage?: UserPackageDto;
    invoiceItems?: InvoiceItemDto[];
    branch: BranchDto;
    notes: string;
    internalNotes: string;
    isActive: boolean;
    updatedAt: string;
  }
}

export interface RedemptionItemMiniDto {
  id: number;
  qty: number;
  ppl: number;
  deductedValue: number;
  originalPrice: number;
  service: {
    id: number;
    code: string;
    fullName: string;
    name: string;
    nameZh: string;
    serviceMinutes: number;
  };
  staff: {
    id: number;
    branchId?: number;
    code: string;
    type: AdminType;
    role?: AdminRole;
    nickname: string;
    nameZh?: string;
    nameEn?: string;
  }
  isAppointedRoom: boolean;
  isAppointedStaff: boolean;
  startTime: string;
  endTime: string;
  startTimeInDate: Date;
  endTimeInDate: Date;
  notes: string;
  room: RoomDto;
  status: ServiceStatus;
  redemption: {
    id: number;
    code: string;
    source: 'VIP' | 'BookingSystem' | 'Bliss';
    date: Date;
    user: UserDto;
    ppl: number;
    userPackage?: {
      remainingValue: number;
    };
    invoiceItems?: {
      invoiceDue: number;
    }[];
    isActive: boolean;
    updatedAt: string;
  }
}