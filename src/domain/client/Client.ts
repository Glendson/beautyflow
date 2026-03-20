export interface Client {
  id: string;
  clinic_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at?: Date;
  updated_at?: Date;
}
