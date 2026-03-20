import { Result } from '@/lib/result';
import { Appointment } from '@/domain/appointment/appointment.entity';
import { IAppointmentRepository } from '@/application/interfaces/IAppointmentRepository';
import { createClient } from '@/infrastructure/supabase/server';

export class SupabaseAppointmentRepository implements IAppointmentRepository {
  async create(appointment: Appointment): Promise<Result<Appointment>> {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          clinic_id: appointment.clinicId,
          employee_id: appointment.employeeId,
          client_id: appointment.clientId,
          service_id: appointment.serviceId,
          room_id: appointment.roomId,
          date: appointment.date,
          duration_minutes: appointment.durationMinutes,
          status: appointment.status,
          notes: appointment.notes,
        }])
        .select()
        .single();

      if (error) {
        return Result.fail(error.message);
      }

      // Reconstitute entity
      const createdEntity = Appointment.create({
        id: data.id,
        clinicId: data.clinic_id,
        employeeId: data.employee_id,
        clientId: data.client_id,
        serviceId: data.service_id,
        roomId: data.room_id,
        date: data.date,
        durationMinutes: data.duration_minutes,
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at
      });

      if (!createdEntity.success) {
          return Result.fail("Failed to map database record to domain entity: " + createdEntity.error);
      }

      return Result.ok(createdEntity.data);
    } catch (error: any) {
      return Result.fail(error.message || "Failed to create appointment");
    }
  }

  async findById(clinicId: string, id: string): Promise<Result<Appointment | null>> {
      return Result.fail("Not implemented");
  }

  async findByDateRange(clinicId: string, startDate: string, endDate: string): Promise<Result<Appointment[]>> {
      return Result.fail("Not implemented");
  }
}
