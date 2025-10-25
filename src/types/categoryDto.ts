import {CategoryType} from "@/types/categoryType";

export interface CategoryDto {
  id: number;
  type: CategoryType;
  order: number;
  name: string
  code?: string;
  subCategories?: {
    id: number;
    order: number;
    name: string
    code?: string;
  }[];
}

export interface PaymentMethodDto extends CategoryDto {
  meta: {
    serviceCharge: number;
  };
  isActive: boolean;
}

export interface UserTierDto {
  id: number;
  order: number;
  name: string
  minSpending: number;
}