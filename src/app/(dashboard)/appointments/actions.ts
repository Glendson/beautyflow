"use server";

import { AppointmentService, ServiceService } from "@/lib/services";
import { revalidatePath } from "next/cache";

export async function createAppointmentAction(formData: FormData) {
  const client_id = formData.get("client_id")?.toString();
  const service_id = formData.get("service_id")?.toString();
  const employee_id = formData.get("employee_id")?.toString();
  const room_id = formData.get("room_id")?.toString() || null;
  const dateStr = formData.get("date")?.toString(); // YYYY-MM-DD
  const timeStr = formData.get("time")?.toString(); // HH:MM

  if (!client_id || !service_id || !employee_id || !dateStr || !timeStr) {
    return { success: false, error: "Missing required fields" };
  }

  // Parse start_time (using local time for MVP)
  const start_time = new Date(`${dateStr}T${timeStr}:00`);

  // Get service duration
  const serviceRes = await ServiceService.getById(service_id);
  if (!serviceRes.success || !serviceRes.data) {
    return { success: false, error: "Service not found" };
  }

  const durationMins = serviceRes.data.duration || 60; // Default to 60 minutes if not specified
  const end_time = new Date(start_time.getTime() + durationMins * 60000);

  const result = await AppointmentService.create({
    client_id,
    service_id,
    employee_id,
    room_id,
    start_time,
    end_time
  });

  if (result.success) {
    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  }
  return result;
}

export async function updateAppointmentStatusAction(id: string, status: string) {
  const result = await AppointmentService.updateStatus(id, status as "scheduled" | "completed" | "canceled" | "no_show");
  if (result.success) {
    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  }
  return result;
}
