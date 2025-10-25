export interface BranchDto {
  id: number;
  order: number;
  code: string;
  shopName: string;
  shopNameEn: string;
  name: string;
  nameEn?: string;
  // nameInFrontend?: string;
  address: string;
  addressEn?: string;
  isAvailableToReserve: boolean;
  openHour: number;
  closeHour: number;
  frontendBookingHourBefore: number;
  frontendBookingLastMinuteDuration: number;
  frontendBookingMaxPpl: number;
  apiUrl?: string;
  invoiceLogoUrl?: {assetUrl: string}[];
  photoUrls?: {assetUrl: string}[];
  menuPhotoUrls?: {assetUrl: string}[];
  descriptionPhotoUrls?: {assetUrl: string}[];
  tenantCode: string;
  tenantName: string;
  tenantNameEn?: string;
}

export interface BranchInternalDto extends BranchDto {
  ipAddresses?: string;
  tncInvoice: string;
  tncReceipt: string;
  apiUrl?: string;
}