import { Result } from '@/lib/result';
import { Appointment } from '@/domain/appointment/appointment.entity';

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<Result<Appointment>>;
  findById(clinicId: string, id: string): Promise<Result<Appointment | null>>;
  findByDateRange(clinicId: string, startDate: string, endDate: string): Promise<Result<Appointment[]>>;
}
