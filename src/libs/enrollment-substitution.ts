import {EnrollmentDto, LessonEnrollmentStatus, SwapApproveStatus} from '@/types/enrollment';

export function canApplyEnrollmentSubstitution(
  enrollment: Pick<EnrollmentDto, 'status' | 'swapApproveStatus' | 'hasSwapped'>,
) {
  return (
    [LessonEnrollmentStatus.Enrolled, LessonEnrollmentStatus.Holiday].includes(enrollment.status) &&
    enrollment.swapApproveStatus === SwapApproveStatus.Approved &&
    !enrollment.hasSwapped
  );
}
