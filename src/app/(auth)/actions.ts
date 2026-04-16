"use server";

import { AuthUseCase } from "@/application/auth/AuthUseCase";
import { ClinicUseCases } from "@/application/clinic/ClinicUseCases";
import { AppointmentUseCases } from "@/application/appointment/AppointmentUseCases";
import { ClientUseCases } from "@/application/client/ClientUseCases";
import { ServiceUseCases } from "@/application/service/ServiceUseCases";
import { EmployeeUseCases } from "@/application/employee/EmployeeUseCases";
import { RoomUseCases } from "@/application/room/RoomUseCases";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { Result } from "@/lib/result";
import { getClinicId } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { Clinic } from "@/domain/clinic/Clinic";
import { Appointment } from "@/domain/appointment/Appointment";
import { Client } from "@/domain/client/Client";
import { Service } from "@/domain/service/Service";
import { Employee } from "@/domain/employee/Employee";
import { Room } from "@/domain/room/Room";
import { PaginatedResult } from "@/lib/pagination";

// ============ AUTH ACTIONS ============

export async function loginAction(formData: FormData): Promise<Result<void>> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return Result.fail("Email and password are required.");
  }

  // Rate limiting: 5 login attempts per hour
  const rateLimitResult = checkRateLimit(`login:${email}`, 5, 3600000);
  if (!rateLimitResult.success) {
    logger.warn(`Login rate limit exceeded`);
    return Result.fail(
      `Too many login attempts. Please try again in ${rateLimitResult.retryAfterSeconds} seconds.`
    );
  }

  logger.debug("Login attempt");

  const result = await AuthUseCase.signIn(email, password);
  
  if (result.success) {
    const clinicId = await getClinicId();
    
    if (!clinicId) {
      logger.error("No clinic ID found after login");
      return Result.fail("User authenticated but clinic information not found. Please contact support.");
    }
    
    // Reset rate limit on successful login
    resetRateLimit(`login:${email}`);
    logger.success("Login successful");
    
    await new Promise(resolve => setTimeout(resolve, 800));
    redirect("/dashboard");
  }

  logger.error("Login failed", result.error);
  return result;
}

export async function signupAction(formData: FormData): Promise<Result<{ clinicId: string }>> {
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const clinicName = formData.get("clinicName")?.toString();

  if (!email || !password || !clinicName || !firstName) {
    return Result.fail("All fields are required.");
  }

  // Rate limiting: 3 signup attempts per hour per IP/email
  const rateLimitResult = checkRateLimit(`signup:${email}`, 3, 3600000);
  if (!rateLimitResult.success) {
    logger.warn(`Signup rate limit exceeded`);
    return Result.fail(
      `Too many signup attempts. Please try again in ${rateLimitResult.retryAfterSeconds} seconds.`
    );
  }

  logger.debug("Signup attempt");

  const result = await AuthUseCase.signUp(email, password, clinicName, firstName, lastName ?? "");

  if (result.success) {
    logger.debug("Getting clinic ID after signup");
    const clinicId = await getClinicId();
    
    if (!clinicId) {
      logger.error("No clinic ID found after signup");
      return Result.fail("Registration successful, but clinic information could not be retrieved. Please try logging in.");
    }
    
    // Reset rate limit on successful signup
    resetRateLimit(`signup:${email}`);
    logger.success("Signup successful");
    
    return Result.ok({ clinicId });
  }

  logger.error("Signup failed", result.error);
  return result;
}

export async function logoutAction() {
  await AuthUseCase.signOut();
  redirect("/login");
}

// ============ CLINIC ACTIONS ============

export async function getClinicAction(): Promise<Result<Clinic>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return ClinicUseCases.getClinic();
}

export async function updateClinicAction(data: Partial<Clinic>): Promise<Result<Clinic>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return ClinicUseCases.updateClinic(data);
}

// ============ APPOINTMENT ACTIONS ============

export async function listAppointmentsAction(
  page: number = 1,
  pageSize: number = 10,
  filters?: { status?: string; clientId?: string; employeeId?: string; search?: string }
): Promise<Result<PaginatedResult<Appointment>>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return AppointmentUseCases.getAppointmentsPaginated(page, pageSize, filters);
}

export async function createAppointmentAction(data: {
  client_id: string;
  service_id: string;
  employee_id: string;
  room_id: string | null;
  start_time: Date;
  end_time: Date;
}): Promise<Result<Appointment>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await AppointmentUseCases.createAppointment(data);
  if (result.success) {
    revalidatePath("/appointments");
  }
  return result;
}

export async function updateAppointmentStatusAction(
  id: string,
  status: 'scheduled' | 'completed' | 'canceled' | 'no_show'
): Promise<Result<Appointment>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await AppointmentUseCases.updateAppointmentStatus(id, status);
  if (result.success) {
    revalidatePath("/appointments");
  }
  return result;
}

export async function deleteAppointmentAction(id: string): Promise<Result<void>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await AppointmentUseCases.deleteAppointment(id);
  if (result.success) {
    revalidatePath("/appointments");
  }
  return result;
}

// ============ CLIENT ACTIONS ============

export async function listClientsAction(
  page: number = 1,
  pageSize: number = 10,
  filters?: { search?: string }
): Promise<Result<PaginatedResult<Client>>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return ClientUseCases.getClientsPaginated(page, pageSize, filters);
}

export async function getClientAction(id: string): Promise<Result<Client>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return ClientUseCases.getClientById(id);
}

export async function createClientAction(data: Omit<Client, "id" | "clinic_id" | "created_at" | "updated_at">): Promise<Result<Client>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await ClientUseCases.createClient(data);
  if (result.success) {
    revalidatePath("/clients");
  }
  return result;
}

export async function updateClientAction(id: string, data: Partial<Client>): Promise<Result<Client>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await ClientUseCases.updateClient(id, data);
  if (result.success) {
    revalidatePath("/clients");
  }
  return result;
}

export async function deleteClientAction(id: string): Promise<Result<void>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await ClientUseCases.deleteClient(id);
  if (result.success) {
    revalidatePath("/clients");
  }
  return result;
}

// ============ SERVICE ACTIONS ============

export async function listServicesAction(
  page: number = 1,
  pageSize: number = 10,
  filters?: { search?: string; categoryId?: string; isActive?: boolean }
): Promise<Result<PaginatedResult<Service>>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return ServiceUseCases.getServicesPaginated(page, pageSize, filters);
}

export async function getServiceAction(id: string): Promise<Result<Service>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return ServiceUseCases.getServiceById(id);
}

export async function createServiceAction(data: Omit<Service, "id" | "clinic_id" | "created_at" | "updated_at">): Promise<Result<Service>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await ServiceUseCases.createService(data);
  if (result.success) {
    revalidatePath("/services");
  }
  return result;
}

export async function updateServiceAction(id: string, data: Partial<Service>): Promise<Result<Service>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await ServiceUseCases.updateService(id, data);
  if (result.success) {
    revalidatePath("/services");
  }
  return result;
}

export async function deleteServiceAction(id: string): Promise<Result<void>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await ServiceUseCases.deleteService(id);
  if (result.success) {
    revalidatePath("/services");
  }
  return result;
}

// ============ EMPLOYEE ACTIONS ============

export async function listEmployeesAction(
  page: number = 1,
  pageSize: number = 10,
  filters?: { search?: string }
): Promise<Result<PaginatedResult<Employee>>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return EmployeeUseCases.getEmployeesPaginated(page, pageSize, filters);
}

export async function getEmployeeAction(id: string): Promise<Result<Employee>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return EmployeeUseCases.getEmployeeById(id);
}

export async function createEmployeeAction(data: { name: string }, serviceIds?: string[]): Promise<Result<Employee>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await EmployeeUseCases.createEmployee(data, serviceIds);
  if (result.success) {
    revalidatePath("/employees");
  }
  return result;
}

export async function updateEmployeeAction(id: string, data: Partial<Employee>, serviceIds?: string[]): Promise<Result<Employee>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await EmployeeUseCases.updateEmployee(id, data, serviceIds);
  if (result.success) {
    revalidatePath("/employees");
  }
  return result;
}

export async function deleteEmployeeAction(id: string): Promise<Result<void>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await EmployeeUseCases.deleteEmployee(id);
  if (result.success) {
    revalidatePath("/employees");
  }
  return result;
}

export async function getEmployeeServicesAction(employeeId: string): Promise<Result<string[]>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return EmployeeUseCases.getEmployeeServices(employeeId);
}

// ============ ROOM ACTIONS ============

export async function listRoomsAction(
  page: number = 1,
  pageSize: number = 10,
  filters?: { search?: string; type?: 'room' | 'station' }
): Promise<Result<PaginatedResult<Room>>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return RoomUseCases.getRoomsPaginated(page, pageSize, filters);
}

export async function getRoomAction(id: string): Promise<Result<Room>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  return RoomUseCases.getRoomById(id);
}

export async function createRoomAction(data: Omit<Room, "id" | "clinic_id" | "created_at" | "updated_at">): Promise<Result<Room>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await RoomUseCases.createRoom(data);
  if (result.success) {
    revalidatePath("/rooms");
  }
  return result;
}

export async function updateRoomAction(id: string, data: Partial<Room>): Promise<Result<Room>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await RoomUseCases.updateRoom(id, data);
  if (result.success) {
    revalidatePath("/rooms");
  }
  return result;
}

export async function deleteRoomAction(id: string): Promise<Result<void>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");

  const result = await RoomUseCases.deleteRoom(id);
  if (result.success) {
    revalidatePath("/rooms");
  }
  return result;
}
