export interface Service {
  id: string;
  clinic_id: string;
  category_id: string | null;
  name: string;
  duration: number;
  requires_room: boolean | null;
  requires_specialist: boolean | null;
}
