export interface Service {
  id: string;
  clinic_id: string;
  category_id: string | null;
  name: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}
