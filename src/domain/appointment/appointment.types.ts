export type AppointmentStatus = 'scheduled' | 'completed' | 'canceled' | 'no_show';

export interface AppointmentProps {
  id?: string;
  clinicId: string;
  employeeId: string;
  roomId?: string;
  clientId: string;
  serviceId: string;
  date: string; // ISO String
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string;
}
