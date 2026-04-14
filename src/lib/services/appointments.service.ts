/**
 * Appointment Service
 *
 * Orquestrates appointment-related operations:
 * - Create, read, update, delete appointments
 * - Validate business rules
 * - Handle multi-tenancy
 */

import { AppointmentUseCases } from "@/application/appointment/AppointmentUseCases";
import { Appointment } from "@/domain/appointment/Appointment";
import { Result } from "@/lib/result";
import { PaginatedResult } from "@/lib/pagination";

export const AppointmentService = {
  /**
   * Get all appointments for the clinic
   */
  async getAll(): Promise<Result<Appointment[]>> {
    return AppointmentUseCases.getAppointments();
  },

  /**
   * Get paginated appointments with filters
   */
  async getPaginated(
    page: number,
    pageSize: number,
    filters?: {
      status?: string;
      clientId?: string;
      employeeId?: string;
      search?: string;
    }
  ): Promise<Result<PaginatedResult<Appointment>>> {
    return AppointmentUseCases.getAppointmentsPaginated(page, pageSize, filters);
  },

  /**
   * Create a new appointment
   */
  async create(data: {
    client_id: string;
    service_id: string;
    employee_id: string;
    room_id: string | null;
    start_time: Date;
    end_time: Date;
  }): Promise<Result<Appointment>> {
    return AppointmentUseCases.createAppointment(data);
  },

  /**
   * Update appointment status
   */
  async updateStatus(
    appointmentId: string,
    status: "scheduled" | "completed" | "canceled" | "no_show"
  ): Promise<Result<Appointment>> {
    return AppointmentUseCases.updateAppointmentStatus(appointmentId, status);
  },

  /**
   * Cancel an appointment
   */
  async cancel(appointmentId: string): Promise<Result<Appointment>> {
    return AppointmentUseCases.updateAppointmentStatus(appointmentId, "canceled");
  },

  /**
   * Mark appointment as completed
   */
  async complete(appointmentId: string): Promise<Result<Appointment>> {
    return AppointmentUseCases.updateAppointmentStatus(appointmentId, "completed");
  },

  /**
   * Mark appointment as no-show
   */
  async markNoShow(appointmentId: string): Promise<Result<Appointment>> {
    return AppointmentUseCases.updateAppointmentStatus(appointmentId, "no_show");
  },
};
