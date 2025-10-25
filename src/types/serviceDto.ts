export interface ServiceDto {
  id: number;
  code: string;
  fullName: string;
  name: string;
  nameZh?: string;
  isActive: boolean;
  serviceMinutes: number;
  displayServiceMinutes?: number;
  serviceGuideLine?: string;
  category1?: string;
  category2?: string;
  categoryTherapistMapping?: string;
  isRoomRequired: boolean;
  isChairRequired: boolean;
  isVisibleInFrontend: boolean;
  canBeBookedInFrontend: boolean;
  canDoIfPregnant: boolean;
  prices: {
    id: number;
    price: number;
    branchId: number;
    serviceId: number;
    startTime: string;
  }[];
  staffTierPrices?: {
    id: number;
    price: number;
    staffTierId: number;
    startTime: string;
  }[];
}