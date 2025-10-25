import {ServiceDto} from "@/types/serviceDto";
import {UserPackageDto} from "@/types/userPackageDto";
import {EnrollmentWithInvoiceItemMiniDto} from "@/types/enrollment";

export interface UserRedemptionAvailabilityDto {
  redeemableServices: ServiceDto[];
  redeemableUserPackages: UserPackageDto[];
  unRedeemableUserPackages: UserPackageDto[];
  redeemableEnrollments: EnrollmentWithInvoiceItemMiniDto[];
}