'use server';

import { createClient } from '@/infrastructure/supabase/server';
import { PublicBookingService } from '@/lib/services/public-booking.service';

interface BookingData {
  clinicId: string;
  serviceId: string;
  employeeId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  date: string;
  time: string;
}

/**
 * Get clinic and its data for public booking page
 */
export async function getClinicDataAction(clinicSlug: string) {
  try {
    // Get clinic by slug
    const clinicResult = await PublicBookingService.getClinicBySlug(
      clinicSlug
    );
    if (!clinicResult.success || !clinicResult.data) {
      return { success: false, error: 'Clinic not found' };
    }

    const clinic = clinicResult.data;

    // Get clinic services
    const servicesResult = await PublicBookingService.getClinicServices(
      clinic.id
    );
    const services = servicesResult.success ? servicesResult.data || [] : [];

    // Get clinic employees
    const employeesResult = await PublicBookingService.getClinicEmployees(
      clinic.id
    );
    const employees = employeesResult.success ? employeesResult.data || [] : [];

    return {
      success: true,
      data: { clinic, services, employees },
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Get available slots for a specific date and service
 */
export async function getAvailableSlotsAction(
  clinicId: string,
  employeeId: string,
  serviceId: string,
  date: string
) {
  try {
    const result = await PublicBookingService.getAvailableSlots(
      clinicId,
      employeeId,
      serviceId,
      date
    );

    if (!result.success) {
      return {
        success: false,
        error: (result as any).error || 'Failed to fetch available slots',
      };
    }

    return { success: true, data: result.data || [] };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Create a booking (client + appointment)
 */
export async function createBookingAction(data: BookingData) {
  try {
    const supabase = await createClient();

    // Check if client exists by email
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('clinic_id', data.clinicId)
      .eq('email', data.clientEmail)
      .maybeSingle();

    let clientId: string;

    // Create or use existing client
    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert([
          {
            clinic_id: data.clinicId,
            name: data.clientName,
            email: data.clientEmail,
            phone: data.clientPhone || null,
          },
        ])
        .select('id')
        .single();

      if (clientError || !newClient) {
        return {
          success: false,
          error: 'Failed to create client',
        };
      }

      clientId = newClient.id;
    }

    // Calculate appointment time
    const [dateStr] = data.date.split('T');
    const startTime = new Date(`${dateStr}T${data.time}:00`);

    // Get service duration
    const { data: service } = await supabase
      .from('services')
      .select('duration')
      .eq('id', data.serviceId)
      .single();

    const durationMinutes = (service as any)?.duration || 60;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    // Check availability one more time
    const isAvailable = await PublicBookingService.isSlotAvailable(
      data.employeeId,
      startTime,
      endTime
    );

    if (!isAvailable) {
      return {
        success: false,
        error:
          'This time slot is no longer available. Please choose another time.',
      };
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert([
        {
          clinic_id: data.clinicId,
          client_id: clientId,
          service_id: data.serviceId,
          employee_id: data.employeeId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'scheduled',
        },
      ])
      .select('id')
      .single();

    if (appointmentError || !appointment) {
      return {
        success: false,
        error: 'Failed to create appointment',
      };
    }

    return {
      success: true,
      data: {
        appointmentId: appointment.id,
        clientId,
      },
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Get booking confirmation details
 */
export async function getBookingConfirmationAction(appointmentId: string) {
  try {
    const supabase = await createClient();

    // Fetch appointment with related data
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(
        `
        id,
        start_time,
        status,
        client_id,
        service_id,
        employee_id,
        clinic_id,
        clients(id, name, email, phone),
        services(id, name, price, duration),
        employees(id, name),
        clinics(id, name, phone, address)
      `
      )
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    return {
      success: true,
      data: {
        appointment,
        client: appointment.clients,
        service: appointment.services,
        employee: appointment.employees,
        clinic: appointment.clinics,
      },
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
