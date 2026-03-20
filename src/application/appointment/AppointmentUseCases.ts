import { AppointmentRepository } from "@/infrastructure/repositories/supabase/AppointmentRepository";
import { Appointment } from "@/domain/appointment/Appointment";
import { AppointmentValidator } from "@/domain/appointment/AppointmentValidator";
import { Result } from "@/lib/result";
import { getClinicId } from "@/lib/auth";

const repository = new AppointmentRepository();

export class AppointmentUseCases {
  static async getAppointments(): Promise<Result<Appointment[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAll(clinicId);
  }

  static async createAppointment(data: {
    client_id: string;
    service_id: string;
    employee_id: string;
    room_id: string | null;
    start_time: Date;
    end_time: Date;
  }): Promise<Result<Appointment>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    // 1. Validate Working Hours
    const hwResult = AppointmentValidator.validateWorkingHours(data.start_time, data.end_time);
    if (!hwResult.success) return hwResult as any;

    // 2. Fetch existing appointments for the day to check overlap
    const startOfDay = new Date(data.start_time);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data.start_time);
    endOfDay.setHours(23, 59, 59, 999);

    const existingResult = await repository.findByDateRange(clinicId, startOfDay, endOfDay);
    if (!existingResult.success) return existingResult as any;

    // 3. Validate Overlap
    const overlapResult = AppointmentValidator.validateOverlap(data, existingResult.data!);
    if (!overlapResult.success) return overlapResult as any;

    // 4. Create
    return repository.create({
      ...data,
      clinic_id: clinicId,
      status: 'scheduled'
    });
  }

  static async updateAppointmentStatus(id: string, status: 'scheduled' | 'completed' | 'canceled' | 'no_show'): Promise<Result<Appointment>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.update(id, { status }, clinicId);
  }

  static async deleteAppointment(id: string): Promise<Result<void>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.delete(id, clinicId);
  }
}
