import { Result } from '@/lib/result';
import { AppointmentProps, AppointmentStatus } from './appointment.types';
import { validateAppointment } from './appointment.rules';

export class Appointment {
  private props: AppointmentProps;

  private constructor(props: AppointmentProps) {
    this.props = props;
  }

  public get id(): string | undefined { return this.props.id; }
  public get clinicId(): string { return this.props.clinicId; }
  public get employeeId(): string { return this.props.employeeId; }
  public get clientId(): string { return this.props.clientId; }
  public get serviceId(): string { return this.props.serviceId; }
  public get roomId(): string | undefined { return this.props.roomId; }
  public get startTime(): string { return this.props.startTime; }
  public get endTime(): string { return this.props.endTime; }
  public get status(): AppointmentStatus { return this.props.status; }
  public get notes(): string | undefined { return this.props.notes; }
  public get createdAt(): string | undefined { return this.props.createdAt; }

  /**
   * Domain rules state transitions
   */
  public complete(): Result<Appointment> {
    if (this.props.status !== 'scheduled') {
      return Result.fail(`Cannot complete appointment with status ${this.props.status}`);
    }
    this.props.status = 'completed';
    return Result.ok(this);
  }

  public cancel(): Result<Appointment> {
    if (this.props.status !== 'scheduled') {
      return Result.fail(`Cannot cancel appointment with status ${this.props.status}`);
    }
    this.props.status = 'canceled';
    return Result.ok(this);
  }

  public registerNoShow(): Result<Appointment> {
    if (this.props.status !== 'scheduled') {
      return Result.fail(`Cannot register no-show with status ${this.props.status}`);
    }
    this.props.status = 'no_show';
    return Result.ok(this);
  }

  /**
   * Factory method pattern guarantees we only create valid Appointments
   */
  public static create(props: AppointmentProps): Result<Appointment> {
    const defaultProps: AppointmentProps = {
      ...props,
      status: props.status || 'scheduled',
      createdAt: props.createdAt || new Date().toISOString(),
    };

    const validationResult = validateAppointment(defaultProps);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(new Appointment(defaultProps));
  }
}
