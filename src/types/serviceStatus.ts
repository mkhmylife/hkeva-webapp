import {RedemptionDto, RedemptionItemDto, RedemptionItemMiniDto} from "@/types/redemptionDto";
import {PackageStatus} from "@/types/packageStatus";

export enum ServiceStatus {
  New= "New",
  Notified = 'Notified',
  Arrived = 'Arrived',
  Completed = 'Completed',
  Absent = 'Absent',
  Cancelled  = 'Cancelled',
}

export const getRedemptionItemColor = (b: RedemptionItemDto | RedemptionItemMiniDto) => {
  if (b.redemption.invoiceItems?.some(i => i.invoiceDue > 0)) {
    return '#b9b900';
  }
  return getServiceStatusColor(b.status);
}

export const getServiceStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case ServiceStatus.New:
      return '#3383C5';
    case ServiceStatus.Notified:
      return '#AA7FD6';
    case ServiceStatus.Arrived:
      return '#ED6B7F';
    case ServiceStatus.Completed:
      return '#47C479';
    case ServiceStatus.Absent:
      return '#BFBFBF';
    case ServiceStatus.Cancelled:
      return 'red';
  }
}

export const getServiceStatus = (status: ServiceStatus) => {
  switch (status) {
    case ServiceStatus.New:
      return 'ServiceStatus.new';
    case ServiceStatus.Notified:
      return 'ServiceStatus.notified';
    case ServiceStatus.Arrived:
      return 'ServiceStatus.arrived';
    case ServiceStatus.Completed:
      return 'ServiceStatus.completed';
    case ServiceStatus.Absent:
      return 'ServiceStatus.absent';
    case ServiceStatus.Cancelled:
      return 'ServiceStatus.cancelled';
  }
}

export const getServiceStatusClassName = (status: ServiceStatus) => {
  switch (status) {
    case ServiceStatus.Completed:
      return 'bg-bliss-successLight text-brandNeural900';
    case ServiceStatus.Absent:
    case ServiceStatus.Cancelled:
      return 'bg-bliss-brandDanger100 text-brandNeural900';
    default:
      return 'bg-bliss-brandNeural200 text-brandNeural900';
  }
}