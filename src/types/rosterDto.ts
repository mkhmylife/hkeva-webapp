import {WorkingHourDto} from "@/types/workingHourDto";
import {AdminUserDto} from "@/types/adminUserDto";
import {TemporaryItemDto} from "@/types/temporaryItemDto";

export interface RosterDto {
  id: number;
  startTime: string;
  endTime: string;
  workingHour?: WorkingHourDto;
  blockedItem?: TemporaryItemDto;
  staff: AdminUserDto;
}