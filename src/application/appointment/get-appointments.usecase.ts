import { Result } from '@/lib/result';
import { Appointment } from '@/domain/appointment/appointment.entity';
import { IAppointmentRepository } from '../interfaces/IAppointmentRepository';

export class GetAppointmentsUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepository) {}

  async execute(clinicId: string, startDate: string, endDate: string): Promise<Result<Appointment[]>> {
    if (!clinicId) return Result.fail("clinicId is required");
    if (!startDate || !endDate) return Result.fail("Date range is required");

    return await this.appointmentRepo.findByDateRange(clinicId, startDate, endDate);
  }
}
