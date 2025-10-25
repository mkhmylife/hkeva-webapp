import {PackageDto} from "@/types/packageDto";
import {AdminUserDto} from "@/types/adminUserDto";
import {UserDto} from "@/types/userDto";
import {PaymentMethodsInput} from "@/components/PaymentMethodModal";
import {ServiceDto} from "@/types/serviceDto";
import {BranchDto} from "@/types/branchDto";
import {PackageStatus} from "@/types/packageStatus";
import {ProductDto} from "@/types/productDto";
import {CourseDto} from "@/types/courseDto";

export interface InvoiceDto {
  id: number;
  isActive: boolean;
  code: string;
  codeF: string;
  date: string;
  notes: string;
  internalNotes: string;
  branchId: number;
  user: UserDto;
  userId: number;
  sales: AdminUserDto[];
  // staffHandler: AdminUserDto;
  // staffHandlerId: number;
  therapists: AdminUserDto[];
  branch: BranchDto;
  type?: string;
  referral?: string;
  payingForDueInvoices?: {
    id: number;
    code: string;
  }[];
  payingForDuePackage?: {
    id: number;
    code: string;
  };
  items: {
    id: number;
    price: number;
    originalPrice: number;
    qty: number;
    discount: number;
    expiryDate?: string;
    total: number;
    payAmount: number;
    serviceId?: number;
    packageId?: number;
    dueInvoiceId?: number;
    duePackageId?: number;
    service?: ServiceDto;
    package?: PackageDto;
    product?: ProductDto;
    course?: CourseDto;
    userPackageStatus?: PackageStatus;
    userPackageRemainingValue?: number;
    paidByDuePackage?: {
      invoiceCode: string;
    };
    transferFromUserPackages?: {
      userPackageId: number;
      value: number;
      userPackageName: string;  // For display only
      package: PackageDto;
      invoiceCode: string;
    }[];
    transferFromUserInvoiceItems?: {
      userInvoiceItemId: number;
      value: number;
      userInvoiceCode: string;  // For display only
      service: ServiceDto;
      invoiceCode: string;
    }[];
    redemptions?: {
      redemptionId: number;
      redemptionCode: string;
      redemptionDate: string;
    }[];
    enrollments?: {
      enrollmentId: number;
      isAttended: boolean;
      lessonId: number;
    }[];
  }[];
  paymentMethods: PaymentMethodsInput['paymentMethods'];
  total: number;
  paid: number;
  due: number;
  bbmslId?: string;
  bbmslUrl?: string;
  promoCode?: {
    id: number;
    code: string;
    name: string;
  };
  updatedAt: string;
}

export interface InvoiceItemDto {
  id: number;
  branchId: number;
  invoiceId: number;
  invoiceCode: string;
  invoiceDate: string;
  invoiceUser: UserDto;
  invoiceDue: number;
  invoicePaid: number;
  invoiceTotal: number;
  price: number;
  originalPrice: number;
  qty: number;
  discount: number;
  expiryDate: string;
  total: number;
  payAmount: number;
  serviceId: number;
  service: ServiceDto;
  updatedAt: string;
}

export interface InvoiceItemMiniDto {
  id: number;
  updatedAt: string;
  invoiceId: number;
  invoiceCode: string;
  invoiceDate: string;
  invoiceDue: number;
  userCode: string;
  userId: number;
  userName: string;
  branchId: number;
  itemCode: string;
  itemName: string;
  total: number;
  price: number;
  originalPrice: number;
  qty: number;
  discount: number;
}

export interface InvoiceItemRedemptionStatusDto {
  invoice: InvoiceDto;
  service: ServiceDto;
  availableToRedeem: number;
  total: number;
  redeemed: number;
}