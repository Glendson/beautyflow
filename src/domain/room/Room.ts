export interface Room {
  id: string;
  clinic_id: string;
  name: string;
  type: 'room' | 'station';
}
