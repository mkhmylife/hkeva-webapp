import {AdminUserDto} from "@/types/adminUserDto";
import {ServiceDto} from "@/types/serviceDto";
import {ServiceStatus} from "@/types/serviceStatus";
import {PackageDto} from "@/types/packageDto";
import {InvoiceItemDto} from "@/types/invoiceDto";
import {BranchDto} from "@/types/branchDto";

export interface UserInvoiceRedemptionHistoryDto {
  id: number;
  staff?: AdminUserDto;
  service?: ServiceDto;
  date: string;
  status: ServiceStatus;
  invoiceItem?: InvoiceItemDto;
  branch?: BranchDto;
  transferFromInvoiceItem?: {
    userPackageId: number;
    value: number;
    userServiceName: string;  // For display only
    service: ServiceDto;
    invoiceCode: string;
  };
  // paidByDuePackage?: {
  //   invoiceCode: string;
  // };
  value: number;
  price?: number;
  balance: number;
}