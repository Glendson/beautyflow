import { AppointmentRepository } from "@/infrastructure/repositories/supabase/AppointmentRepository";
import { Appointment } from "@/domain/appointment/Appointment";
import { AppointmentValidator } from "@/domain/appointment/AppointmentValidator";
import { Result } from "@/lib/result";
import { PaginatedResult } from "@/lib/pagination";
import { getClinicId } from "@/lib/auth";

const repository = new AppointmentRepository();

export class AppointmentUseCases {
  static async getAppointments(): Promise<Result<Appointment[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAll(clinicId);
  }

  /**
   * Get appointments with pagination and optional date range
   * 
   * PERFORMANCE NOTE: When querying appointments for dashboard/list views,
   * ALWAYS include startDate and endDate to limit query scope.
   * Without date range, this queries all appointments (full table scan risk)
   * 
   * @param page pagination page number (1-indexed)
   * @param pageSize records per page (recommended: 20-50)
   * @param filters optional filters including startDate and endDate
   * @returns paginated appointments with total count
   */
  static async getAppointmentsPaginated(
    page: number,
    pageSize: number,
    filters?: { 
      status?: string; 
      clientId?: string; 
      employeeId?: string; 
      search?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Result<PaginatedResult<Appointment>>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAllPaginated(clinicId, page, pageSize, filters);
  }

  /**
   * Get dashboard metrics (aggregated data)
   * 
   * PERFORMANCE: This method aggregates appointment data for dashboard metrics
   * Uses date range filters to avoid scanning all historical appointments
   * 
   * @param startDate range start (typically "today")
   * @param endDate range end (typically "today + 30 days")
   * @returns metrics including total, scheduled, completed, no_show counts
   */
  static async getMetrics(startDate: Date, endDate: Date): Promise<Result<{
    totalAppointments: number;
    scheduledAppointments: number;
    completedAppointments: number;
    noShowAppointments: number;
    canceledAppointments: number;
  }>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    // Get all appointments in date range (paginate to avoid memory issues)
    const metricsResult = await repository.findAllPaginated(clinicId, 1, 1000, {
      startDate,
      endDate
    });

    if (!metricsResult.success) return metricsResult as any;

    const appointments = metricsResult.data?.data || [];
    
    const metrics = {
      totalAppointments: metricsResult.data?.total || 0,
      scheduledAppointments: appointments.filter(a => a.status === 'scheduled').length,
      completedAppointments: appointments.filter(a => a.status === 'completed').length,
      noShowAppointments: appointments.filter(a => a.status === 'no_show').length,
      canceledAppointments: appointments.filter(a => a.status === 'canceled').length,
    };

    return Result.ok(metrics);
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
