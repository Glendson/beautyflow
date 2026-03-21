import { IAppointmentRepository } from "@/domain/appointment/IAppointmentRepository";
import { Appointment } from "@/domain/appointment/Appointment";
import { Result } from "@/lib/result";
import { createClient } from "@/infrastructure/supabase/server";

export class AppointmentRepository implements IAppointmentRepository {
  async findById(id: string, clinicId: string): Promise<Result<Appointment>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .eq('clinic_id', clinicId)
      .single();

    if (error || !data) return Result.fail(error?.message || "Appointment not found");
    return Result.ok(this.mapToEntity(data));
  }

  async findAll(clinicId: string): Promise<Result<Appointment[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('start_time');

    if (error) return Result.fail(error.message);
    return Result.ok((data || []).map((d: DBAppointment) => this.mapToEntity(d)));
  }

  async findByDateRange(clinicId: string, start: Date, end: Date): Promise<Result<Appointment[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('clinic_id', clinicId)
      .gte('start_time', start.toISOString())
      .lt('start_time', end.toISOString())
      .order('start_time');

    if (error) return Result.fail(error.message);
    return Result.ok((data || []).map((d: DBAppointment) => this.mapToEntity(d)));
  }

  async findByEmployeeAndDateRange(clinicId: string, employeeId: string, start: Date, end: Date): Promise<Result<Appointment[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('employee_id', employeeId)
      .gte('start_time', start.toISOString())
      .lt('start_time', end.toISOString())
      .order('start_time');

    if (error) return Result.fail(error.message);
    return Result.ok((data || []).map((d: DBAppointment) => this.mapToEntity(d)));
  }

  async create(entity: Partial<Appointment> & { clinic_id: string }): Promise<Result<Appointment>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        clinic_id: entity.clinic_id,
        client_id: entity.client_id!,
        service_id: entity.service_id!,
        employee_id: entity.employee_id!,
        room_id: entity.room_id || null,
        start_time: entity.start_time!.toISOString(),
        end_time: entity.end_time!.toISOString(),
        status: entity.status || 'scheduled',
      })
      .select()
      .single();

    if (error || !data) return Result.fail(error?.message || "Failed to create appointment");
    return Result.ok(this.mapToEntity(data));
  }

  async update(id: string, entity: Partial<Appointment>, clinicId: string): Promise<Result<Appointment>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('appointments')
      .update({
        client_id: entity.client_id,
        service_id: entity.service_id,
        employee_id: entity.employee_id,
        room_id: entity.room_id,
        start_time: entity.start_time?.toISOString(),
        end_time: entity.end_time?.toISOString(),
        status: entity.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('clinic_id', clinicId)
      .select()
      .single();

    if (error || !data) return Result.fail(error?.message || "Failed to update appointment");
    return Result.ok(this.mapToEntity(data));
  }

  async delete(id: string, clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('clinic_id', clinicId);

    if (error) return Result.fail(error.message);
    return Result.ok<void>(undefined);
  }

  private mapToEntity(data: DBAppointment): Appointment {
    return {
      id: data.id,
      clinic_id: data.clinic_id,
      client_id: data.client_id,
      service_id: data.service_id,
      employee_id: data.employee_id,
      room_id: data.room_id,
      start_time: new Date(data.start_time),
      end_time: new Date(data.end_time),
      status: data.status,
      created_at: data.created_at ? new Date(data.created_at) : undefined,
      updated_at: data.updated_at ? new Date(data.updated_at) : undefined
    };
  }
}

interface DBAppointment {
  id: string;
  clinic_id: string;
  client_id: string;
  service_id: string;
  employee_id: string;
  room_id: string | null;
  start_time: string;
  end_time: string;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
}
}
