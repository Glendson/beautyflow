import { Result } from '@/lib/result';
import { Appointment } from '@/domain/appointment/appointment.entity';
import { AppointmentProps } from '@/domain/appointment/appointment.types';
import { IAppointmentRepository } from '../interfaces/IAppointmentRepository';

export class CreateAppointmentUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepository) {}

  async execute(props: AppointmentProps): Promise<Result<Appointment>> {
    // 1. Validate and create entity
    const appointmentOrError = Appointment.create(props);
    
    if (!appointmentOrError.success) {
      return Result.fail(appointmentOrError.error);
    }

    const appointment = appointmentOrError.data;

    // 2. Domain Rule: Cannot overlap for same employee
    // In a full implementation, we would query the repository to check existing configurations.
    // e.g., const existing = await this.appointmentRepo.findByDateRange(...)

    // 3. Persist
    return await this.appointmentRepo.create(appointment);
  }
}
