import { createClient } from "@/infrastructure/supabase/server";
import { Service } from "@/domain/service/Service";
import { Employee } from "@/domain/employee/Employee";
import { Clinic } from "@/domain/clinic/Clinic";

/**
 * Public Booking Service
 * Handles data retrieval for public booking page (no auth required)
 * All data is filtered to show only active items
 */
export class PublicBookingService {
  /**
   * Get clinic by slug (public data only)
   */
  static async getClinicBySlug(slug: string): Promise<
    { success: true; data: Clinic } | { success: false; error: string }
  > {
    try {
      const client = await createClient();
      const { data, error } = await client
        .from("clinics")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) {
        return {
          success: false,
          error: `Clinic not found: ${error.message}`,
        };
      }

      return { success: true, data: data as Clinic };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  /**
   * Get active services for a clinic (public)
   */
  static async getClinicServices(
    clinicId: string
  ): Promise<{ success: true; data: Service[] } | { success: false; error: string }> {
    try {
      const client = await createClient();
      const { data, error } = await client
        .from("services")
        .select("*")
        .eq("clinic_id", clinicId)
        .eq("is_active", true)
        .order("name");

      if (error) {
        return {
          success: false,
          error: `Failed to fetch services: ${error.message}`,
        };
      }

      return { success: true, data: (data || []) as Service[] };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  /**
   * Get active employees for a clinic (public)
   */
  static async getClinicEmployees(
    clinicId: string
  ): Promise<{ success: true; data: Employee[] } | { success: false; error: string }> {
    try {
      const client = await createClient();
      const { data, error } = await client
        .from("employees")
        .select("*")
        .eq("clinic_id", clinicId)
        .eq("is_active", true)
        .order("name");

      if (error) {
        return {
          success: false,
          error: `Failed to fetch employees: ${error.message}`,
        };
      }

      return { success: true, data: (data || []) as Employee[] };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  /**
   * Get available time slots for a service on a given date
   */
  static async getAvailableSlots(
    clinicId: string,
    employeeId: string,
    serviceId: string,
    date: string
  ): Promise<{ success: true; data: string[] } | { success: false; error: string }> {
    try {
      const client = await createClient();
      const dateStr = typeof date === "string" ? date : new Date(date).toISOString().split("T")[0];
      
      // Default clinic hours: 9:00 - 18:00
      const startHour = "09:00";
      const endHour = "18:00";

      // Get service duration
      const { data: service, error: serviceError } = await client
        .from("services")
        .select("duration_minutes")
        .eq("id", serviceId)
        .single();

      if (serviceError || !service) {
        return {
          success: false,
          error: "Service not found",
        };
      }

      // Type guard for proper TypeScript inference
      const serviceDuration = ((service as unknown) as { duration_minutes: number }).duration_minutes || 60;

      // Get existing appointments for this employee on this date
      const { data: appointments, error: appointmentError } = await client
        .from("appointments")
        .select("start_time, end_time")
        .eq("employee_id", employeeId)
        .gte("start_time", `${dateStr}T00:00:00`)
        .lt("start_time", `${dateStr}T23:59:59`)
        .eq("status", "scheduled");

      if (appointmentError) {
        return {
          success: false,
          error: `Failed to fetch appointments: ${appointmentError.message}`,
        };
      }

      // Generate available slots (30-min intervals)
      const slots = this.generateAvailableSlots(
        startHour,
        endHour,
        serviceDuration,
        appointments || []
      );

      return { success: true, data: slots };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  /**
   * Check if time slot is available
   */
  static async isSlotAvailable(
    employeeId: string,
    startTime: Date,
    endTime: Date,
    roomId?: string
  ): Promise<boolean> {
    try {
      const client = await createClient();

      // Check employee conflict
      const { data: employeeConflict } = await client
        .from("appointments")
        .select("id")
        .eq("employee_id", employeeId)
        .lt("start_time", endTime.toISOString())
        .gt("end_time", startTime.toISOString())
        .eq("status", "scheduled")
        .limit(1);

      if (employeeConflict && employeeConflict.length > 0) {
        return false;
      }

      // Check room conflict if specified
      if (roomId) {
        const { data: roomConflict } = await client
          .from("appointments")
          .select("id")
          .eq("room_id", roomId)
          .lt("start_time", endTime.toISOString())
          .gt("end_time", startTime.toISOString())
          .eq("status", "scheduled")
          .limit(1);

        if (roomConflict && roomConflict.length > 0) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate available time slots
   * Accounts for working hours and existing appointments
   */
  private static generateAvailableSlots(
    startHour: string,
    endHour: string,
    durationMinutes: number,
    existingAppointments: Array<{ start_time: string; end_time: string }>
  ): string[] {
    const slots: string[] = [];
    const [startH, startM] = startHour.split(":").map(Number);
    const [endH, endM] = endHour.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // Generate 30-minute slots
    for (let i = startMinutes; i + durationMinutes <= endMinutes; i += 30) {
      const hour = Math.floor(i / 60);
      const minute = i % 60;
      const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;

      // Check if slot conflicts with existing appointments
      const slotStart = i;
      const slotEnd = i + durationMinutes;

      const hasConflict = existingAppointments.some((apt) => {
        const aptStart = this.timeToMinutes(apt.start_time);
        const aptEnd = this.timeToMinutes(apt.end_time);
        return slotStart < aptEnd && slotEnd > aptStart;
      });

      if (!hasConflict) {
        slots.push(timeStr);
      }
    }

    return slots;
  }

  /**
   * Convert time string to minutes
   */
  private static timeToMinutes(timeStr: string): number {
    // Handle ISO timestamp format
    if (timeStr.includes("T")) {
      const parts = timeStr.split("T")[1].split(":");
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    // Handle HH:MM format
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  }
}
