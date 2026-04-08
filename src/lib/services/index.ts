/**
 * Services Layer - Centralized Exports
 *
 * This layer orquestrates business logic and connects Server Actions to Use Cases.
 * Services act as facades to the application layer, coordinating operations
 * and managing dependencies.
 *
 * Usage:
 * import { AppointmentService, ClientService, ... } from '@/lib/services'
 */

export { AppointmentService } from "./appointments.service";
export { ClientService } from "./clients.service";
export { EmployeeService } from "./employees.service";
export { RoomService } from "./rooms.service";
export { ServiceService } from "./beauty-services.service";
export { ClinicService } from "./clinics.service";
