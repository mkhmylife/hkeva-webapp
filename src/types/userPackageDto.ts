import {PackageDto} from "@/types/packageDto";
import {PackageStatus} from "@/types/packageStatus";
import {BranchDto} from "@/types/branchDto";

export interface UserPackageDto {
  id: number;
  branch: BranchDto;
  invoiceId: number;
  invoiceCode: string;
  purchaseDate: Date;
  originalValue: number;
  remainingValue: number;
  remainingValueAtInvoiceDate?: number; // only available in getMemberPackage api
  expiryDate: Date;
  package: PackageDto;
  isActive: boolean;
  status: PackageStatus;
}