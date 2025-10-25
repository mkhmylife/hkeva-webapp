import {ServiceDto} from "@/types/serviceDto";

export interface CouponAdminDto {
  id: number;
  code: string;
  name: string;
  valueInCash?: number;
  valueInPct?: number;
  minSpend: number;
  limit?: number;
  limitPerUser?: number;
  limitPerUserYearly?: number;
  needBrandNewUser: boolean;
  isActive: boolean;
  weekdayLimit: string[];
  branchLimit: string[];
  canRedeemService?: ServiceDto;
  tnc: string;
  photoUrl: string;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  valueInCash?: number;
  valueInPct?: number;
  canRedeemService?: {
    serviceId: number;
    valueInCash?: number;
  }
  tnc: string;
  photoUrl: string;
}

export interface CouponCompanyDto {
  id: number;
  name: string;
  shortName: string;
  code: string;
}