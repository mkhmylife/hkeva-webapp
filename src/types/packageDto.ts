import {BranchDto} from "@/types/branchDto";

export interface PackageDto {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  value: number;
  price: number;
  defaultValidMonth: number;
  category1?: string;
  category2?: string;
  availableBranches: BranchDto[];
}