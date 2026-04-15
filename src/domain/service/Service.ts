export interface Service {
  id: string;
  clinic_id: string;
  category_id: string | null;
  name: string;
  duration?: number;
  price?: number;
  description?: string;
  requires_room?: boolean | null;
  requires_specialist?: boolean | null;
  is_active: boolean;
  created_at?: string;
}
