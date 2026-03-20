import { Result } from '@/lib/result';
import { AppointmentProps } from './appointment.types';

/**
 * Validates the core business rules for an Appointment.
 */
export const validateAppointment = (props: AppointmentProps): Result<true> => {
  if (!props.clinicId) return Result.fail("clinicId is required");
  if (!props.employeeId) return Result.fail("employeeId is required");
  if (!props.clientId) return Result.fail("clientId is required");
  if (!props.serviceId) return Result.fail("serviceId is required");
  if (!props.startTime) return Result.fail("startTime is required");
  if (!props.endTime) return Result.fail("endTime is required");
  
  const start = new Date(props.startTime);
  const end = new Date(props.endTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return Result.fail("Invalid date format");
  }

  if (end <= start) {
    return Result.fail("End time must be after start time");
  }

  return Result.ok(true);
}
