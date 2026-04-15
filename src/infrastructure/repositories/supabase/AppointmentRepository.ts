import { IAppointmentRepository } from "@/domain/appointment/IAppointmentRepository";
import { Appointment, AppointmentStatus } from "@/domain/appointment/Appointment";
import { Result } from "@/lib/result";
import { PaginatedResult, createPaginatedResult, getPaginationParams } from "@/lib/pagination";
import { createClient } from "@/infrastructure/supabase/server";

export class AppointmentRepository implements IAppointmentRepository {
  // Explicit column selection to avoid N+1 queries and unnecessary data transfer
  // Schema: appointments has id, clinic_id, client_id, service_id, employee_id, room_id, start_time, end_time, status, created_at, notes
  private readonly defaultColumns = 'id,clinic_id,client_id,service_id,employee_id,room_id,start_time,end_time,status,created_at,notes';

  async findById(id: string, clinicId: string): Promise<Result<Appointment>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select(this.defaultColumns)
      .eq('id', id)
      .eq('clinic_id', clinicId)
      .single();

    if (error || !data) return Result.fail(error?.message || "Appointment not found");
    return Result.ok(this.mapToEntity(data as DBAppointment));
  }

  async findAll(clinicId: string): Promise<Result<Appointment[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select(this.defaultColumns)
      .eq('clinic_id', clinicId)
      .order('start_time');

    if (error) return Result.fail(error.message);
    return Result.ok((data || []).map((d: DBAppointment) => this.mapToEntity(d)));
  }

  /**
   * Find appointments with pagination support
   * Supports filters: status, clientId, employeeId, dateRange
   * PERFORMANCE: Uses explicit select() to avoid N+1 queries and includes indexes on (clinic_id, status, employee_id, start_time)
   * Response time target: < 100ms for typical clinic load (< 1000 appointments/day)
   */
  async findAllPaginated(
    clinicId: string,
    page: number,
    pageSize: number,
    filters?: { status?: string; clientId?: string; employeeId?: string; search?: string; startDate?: Date; endDate?: Date }
  ): Promise<Result<PaginatedResult<Appointment>>> {
    const supabase = await createClient();
    const { limit, offset } = getPaginationParams(page, pageSize);

    // Build query for count
    let countQuery = supabase
      .from('appointments')
      .select('id', { count: 'exact' })
      .eq('clinic_id', clinicId);

    // Build query for data - explicit column selection
    let dataQuery = supabase
      .from('appointments')
      .select(this.defaultColumns)
      .eq('clinic_id', clinicId);

    // Apply filters
    if (filters?.status) {
      countQuery = countQuery.eq('status', filters.status);
      dataQuery = dataQuery.eq('status', filters.status);
    }

    if (filters?.clientId) {
      countQuery = countQuery.eq('client_id', filters.clientId);
      dataQuery = dataQuery.eq('client_id', filters.clientId);
    }

    if (filters?.employeeId) {
      countQuery = countQuery.eq('employee_id', filters.employeeId);
      dataQuery = dataQuery.eq('employee_id', filters.employeeId);
    }

    // Date range filter (crucial for dashboard performance)
    if (filters?.startDate && filters?.endDate) {
      countQuery = countQuery
        .gte('start_time', filters.startDate.toISOString())
        .lt('start_time', filters.endDate.toISOString());
      dataQuery = dataQuery
        .gte('start_time', filters.startDate.toISOString())
        .lt('start_time', filters.endDate.toISOString());
    }

    // Apply search (search in appointment id)
    if (filters?.search) {
      dataQuery = dataQuery.ilike('id', `%${filters.search}%`);
    }

    // Get count
    const { count, error: countError } = await countQuery;
    if (countError) return Result.fail(countError.message);

    // Get data with pagination
    const { data, error: dataError } = await dataQuery
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1);

    if (dataError) return Result.fail(dataError.message);

    const total = count || 0;
    const appointments = (data || []).map((d: DBAppointment) => this.mapToEntity(d));
    
    return Result.ok(createPaginatedResult(appointments, total, page, pageSize));
  }

  async findByDateRange(clinicId: string, start: Date, end: Date): Promise<Result<Appointment[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select(this.defaultColumns)
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
      .select(this.defaultColumns)
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
        notes: entity.notes || null
      })
      .select(this.defaultColumns)
      .single();

    if (error || !data) return Result.fail(error?.message || "Failed to create appointment");
    return Result.ok(this.mapToEntity(data as DBAppointment));
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
        notes: entity.notes
      })
      .eq('id', id)
      .eq('clinic_id', clinicId)
      .select(this.defaultColumns)
      .single();

    if (error || !data) return Result.fail(error?.message || "Failed to update appointment");
    return Result.ok(this.mapToEntity(data as DBAppointment));
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
      clinic_id: data.clinic_id!,
      client_id: data.client_id!,
      service_id: data.service_id!,
      employee_id: data.employee_id!,
      room_id: data.room_id,
      start_time: new Date(data.start_time),
      end_time: new Date(data.end_time),
      status: (data.status ?? 'scheduled') as AppointmentStatus,
      created_at: data.created_at ? new Date(data.created_at) : undefined,
      notes: data.notes || undefined
    };
  }
}

interface DBAppointment {
  id: string;
  clinic_id: string | null;
  client_id: string | null;
  service_id: string | null;
  employee_id: string | null;
  room_id: string | null;
  start_time: string;
  end_time: string;
  status: string | null;
  created_at?: string | null;
  notes?: string | null;
}

