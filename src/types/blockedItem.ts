import {AdminUserDto} from "@/types/adminUserDto";
import {RoomDto} from "@/types/roomDto";

export interface BlockedItem {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  date: string;
  therapist?: AdminUserDto;
  room?: RoomDto;
}