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
  if (!props.date) return Result.fail("date is required");
  
  const appointmentDate = new Date(props.date);
  if (isNaN(appointmentDate.getTime())) {
    return Result.fail("Invalid date format");
  }

  if (props.durationMinutes <= 0) {
    return Result.fail("Duration must be greater than zero");
  }

  return Result.ok(true);
}
