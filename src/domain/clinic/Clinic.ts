export interface Clinic {
  id: string;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  description?: string | null;
  working_hours_start?: string | null;
  working_hours_end?: string | null;
  is_active?: boolean;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
}
