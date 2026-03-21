import { Result } from '@/lib/result';
import { AppointmentProps } from './appointment.types';

const VALID_STATUSES = ['scheduled', 'completed', 'canceled', 'no_show'] as const;
type AppointmentStatus = typeof VALID_STATUSES[number];

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

/**
 * Validates appointment creation with extended checks
 * Includes status validation and duration checks
 */
type APIAppointment = {
  clinic_id?: string | null;
  service_id?: string | null;
  employee_id?: string | null;
  client_id?: string | null;
  room_id?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: AppointmentStatus | string | null;
  [key: string]: unknown;
};

export const validateAppointmentCreation = (appointment: APIAppointment): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!appointment.clinic_id) errors.push('clinic_id is required');
  if (!appointment.service_id) errors.push('service_id is required');
  if (!appointment.employee_id) errors.push('employee_id is required');
  if (!appointment.client_id) errors.push('client_id is required');

  // Time validation
  if (!appointment.start_time) errors.push('start_time is required');
  if (!appointment.end_time) errors.push('end_time is required');

  if (appointment.start_time && appointment.end_time) {
    const start = new Date(appointment.start_time);
    const end = new Date(appointment.end_time);

    if (isNaN(start.getTime())) errors.push('start_time has invalid date format');
    if (isNaN(end.getTime())) errors.push('end_time has invalid date format');

    if (end <= start) {
      errors.push('End time must be after start time');
    }

    // Duration check
    if (end.getTime() - start.getTime() <= 0) {
      errors.push('Duration must be greater than 0');
    }
  }

  // Status validation
  if (appointment.status && !VALID_STATUSES.includes(appointment.status as AppointmentStatus)) {
    errors.push('Invalid status');
  }

  // Completed appointments cannot be created (only transitioned to)
  if (appointment.status === 'completed') {
    errors.push('Cannot create appointment in completed status');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates status transitions for appointments
 * Enforces immutability of completed appointments
 */
export const validateStatusTransition = (
  currentStatus: AppointmentStatus | string,
  newStatus: AppointmentStatus | string
): { valid: boolean; error?: string } => {
  // Validate both statuses exist
  if (!VALID_STATUSES.includes(currentStatus as AppointmentStatus)) {
    return { valid: false, error: `Invalid current status: ${currentStatus}` };
  }
  if (!VALID_STATUSES.includes(newStatus as AppointmentStatus)) {
    return { valid: false, error: `Invalid target status: ${newStatus}` };
  }

  // Completed appointments are immutable
  if (currentStatus === 'completed') {
    return { valid: false, error: 'Cannot change completed appointment' };
  }

  // Canceled appointments are immutable
  if (currentStatus === 'canceled') {
    return { valid: false, error: 'Cannot change canceled appointment' };
  }

  // no_show appointments are immutable
  if (currentStatus === 'no_show') {
    return { valid: false, error: 'Cannot change no_show appointment' };
  }

  // From scheduled, allow transition to completed, canceled, or no_show
  if (currentStatus === 'scheduled') {
    if ((['scheduled', 'completed', 'canceled', 'no_show'] as AppointmentStatus[]).includes(newStatus as AppointmentStatus)) {
      return { valid: true };
    }
  }

  return { valid: true };
};
