export interface ProductDto {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  category1?: string;
  category2?: string;
  price: number;
  stocks?: {
    id: number;
    branchId: number;
    qty: number;
  }[];
}