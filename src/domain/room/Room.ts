export interface Room {
  id: string;
  clinic_id: string;
  name: string;
  type: 'room' | 'station';
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}
