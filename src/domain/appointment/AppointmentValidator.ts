import { Result } from "@/lib/result";
import { Appointment } from "./Appointment";

export class AppointmentValidator {
  static validateOverlap(
    newAppt: { start_time: Date; end_time: Date; employee_id: string; room_id: string | null },
    existingAppts: Appointment[]
  ): Result<void> {
    for (const appt of existingAppts) {
      if (appt.status === 'canceled' || appt.status === 'no_show') continue;

      const newStart = newAppt.start_time.getTime();
      const newEnd = newAppt.end_time.getTime();
      const extStart = appt.start_time.getTime();
      const extEnd = appt.end_time.getTime();

      // Check time overlap (exclusive on boundaries)
      if (newStart < extEnd && newEnd > extStart) {
        if (appt.employee_id === newAppt.employee_id) {
          return Result.fail("Employee is already booked for this time");
        }
        if (newAppt.room_id && appt.room_id === newAppt.room_id) {
          return Result.fail("Room is already booked for this time");
        }
      }
    }
    return Result.ok(undefined as any);
  }

  static validateWorkingHours(startTime: Date, endTime: Date): Result<void> {
    const startHour = startTime.getHours();
    const endHour = endTime.getHours();
    const endMinutes = endTime.getMinutes();

    // Default 9 AM to 6 PM
    if (startHour < 9 || endHour > 18 || (endHour === 18 && endMinutes > 0)) {
      return Result.fail("Appointment must be within working hours (9:00 AM - 6:00 PM)");
    }
    return Result.ok(undefined as any);
  }
}
