export type AppointmentStatus = 'scheduled' | 'completed' | 'canceled' | 'no_show';

export interface AppointmentProps {
  id?: string;
  clinicId: string;
  employeeId: string;
  roomId?: string;
  clientId: string;
  serviceId: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string;
}
