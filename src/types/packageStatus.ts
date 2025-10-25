export enum PackageStatus {
  Active = 'Active',
  Used = 'Used',
  Expired = 'Expired',
}

export const getPackageStatus = (status: PackageStatus) => {
  switch (status) {
    case PackageStatus.Active:
      return 'Package.status-active';
    case PackageStatus.Used:
      return 'Package.status-used';
    case PackageStatus.Expired:
      return 'Package.status-expired';
  }
}

export const getPackageStatusClassName = (status: PackageStatus) => {
  switch (status) {
    case PackageStatus.Active:
      return 'bg-bliss-successLight text-brandNeural900';
    case PackageStatus.Used:
      return '已用完';
    case PackageStatus.Expired:
      return '已過期';
  }
}