export interface Employee {
  id: string;
  clinic_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  service_ids?: string[]; // The services this employee can perform
  created_at?: Date;
  updated_at?: Date;
}
