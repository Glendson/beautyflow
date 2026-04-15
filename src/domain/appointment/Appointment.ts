export type AppointmentStatus = 'scheduled' | 'completed' | 'canceled' | 'no_show';

export interface Appointment {
  id: string;
  clinic_id: string;
  client_id: string;
  service_id: string;
  employee_id: string;
  room_id: string | null;
  start_time: Date;
  end_time: Date;
  status: AppointmentStatus;
  created_at?: Date;
  notes?: string;
}
