import { IRepository } from "@/domain/repository";
import { Appointment } from "./Appointment";
import { Result } from "@/lib/result";

export interface IAppointmentRepository extends IRepository<Appointment> {
  findByDateRange(clinicId: string, start: Date, end: Date): Promise<Result<Appointment[]>>;
  findByEmployeeAndDateRange(clinicId: string, employeeId: string, start: Date, end: Date): Promise<Result<Appointment[]>>;
}
