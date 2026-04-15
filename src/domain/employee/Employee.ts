export interface Employee {
  id: string;
  clinic_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  specialty?: string | null;
  is_active?: boolean;
  created_at?: string;
}
