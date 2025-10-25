import {AdminUserDto} from "@/types/adminUserDto";
import {ServiceDto} from "@/types/serviceDto";
import {ServiceStatus} from "@/types/serviceStatus";
import {PackageDto} from "@/types/packageDto";
import {InvoiceItemDto} from "@/types/invoiceDto";
import {BranchDto} from "@/types/branchDto";

export interface UserPackageRedemptionHistoryDto {
  id: number;
  staff?: AdminUserDto;
  service?: ServiceDto;
  date: string;
  status: ServiceStatus;
  invoiceItem?: InvoiceItemDto;
  package?: PackageDto;
  userPackageUsedValueOverride?: number;
  branch?: BranchDto;
  transferFromUserPackage?: {
    userPackageId: number;
    value: number;
    userPackageName: string;  // For display only
    package: PackageDto;
    invoiceCode: string;
  };
  transferFromInvoiceItem?: {
    userPackageId: number;
    value: number;
    userServiceName: string;  // For display only
    service: ServiceDto;
    invoiceCode: string;
  };
  transferToUserPackage?: {
    userPackageId: number;
    value: number;
    userPackageName: string;  // For display only
    package: PackageDto;
    invoiceCode: string;
  };
  paidByDuePackage?: {
    invoiceCode: string;
  };
  value: number;
  balance: number;
}