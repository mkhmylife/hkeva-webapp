import {RoomType} from "@/types/roomType";

export interface RoomDto {
  id: number;
  order: number;
  name: string;
  capacity: number;
  branchId: number;
  type: RoomType;
  isAvailableToThai: boolean;
  cannotPerformServiceMap: string[];
  mapUrl?: string;
}