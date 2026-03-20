import { describe, it, expect } from 'vitest';
import { AppointmentValidator } from './AppointmentValidator';
import { Appointment } from './Appointment';

describe('AppointmentValidator', () => {
  describe('validateWorkingHours', () => {
    it('should pass for appointments within 9 AM to 6 PM', () => {
      const start = new Date(2026, 2, 20, 10, 0);
      const end = new Date(2026, 2, 20, 11, 0);
      const result = AppointmentValidator.validateWorkingHours(start, end);
      expect(result.success).toBe(true);
    });

    it('should fail if appointment starts before 9 AM', () => {
      const start = new Date(2026, 2, 20, 8, 30);
      const end = new Date(2026, 2, 20, 9, 30);
      const result = AppointmentValidator.validateWorkingHours(start, end);
      expect(result.success).toBe(false);
      expect(result.error).toContain('working hours');
    });

    it('should fail if appointment ends after 6 PM', () => {
      const start = new Date(2026, 2, 20, 17, 30);
      const end = new Date(2026, 2, 20, 18, 30);
      const result = AppointmentValidator.validateWorkingHours(start, end);
      expect(result.success).toBe(false);
    });

    it('should pass if appointment ends exactly at 6 PM', () => {
      const start = new Date(2026, 2, 20, 17, 30);
      const end = new Date(2026, 2, 20, 18, 0);
      const result = AppointmentValidator.validateWorkingHours(start, end);
      expect(result.success).toBe(true);
    });
  });

  describe('validateOverlap', () => {
    const existingAppointments: Appointment[] = [
      {
        id: '1', clinic_id: 'c1', client_id: 'cl1', service_id: 's1', employee_id: 'e1', room_id: 'r1',
        start_time: new Date(2026, 2, 20, 10, 0), end_time: new Date(2026, 2, 20, 11, 0),
        status: 'scheduled'
      },
      {
        id: '2', clinic_id: 'c1', client_id: 'cl2', service_id: 's2', employee_id: 'e2', room_id: null,
        start_time: new Date(2026, 2, 20, 14, 0), end_time: new Date(2026, 2, 20, 15, 0),
        status: 'scheduled'
      }
    ];

    it('should pass if there is no overlap', () => {
      const newAppt = {
        start_time: new Date(2026, 2, 20, 11, 0),
        end_time: new Date(2026, 2, 20, 12, 0),
        employee_id: 'e1',
        room_id: 'r1'
      };
      const result = AppointmentValidator.validateOverlap(newAppt, existingAppointments);
      expect(result.success).toBe(true);
    });

    it('should fail if there is employee overlap', () => {
      const newAppt = {
        start_time: new Date(2026, 2, 20, 10, 30),
        end_time: new Date(2026, 2, 20, 11, 30),
        employee_id: 'e1',
        room_id: 'r2' // Different room
      };
      const result = AppointmentValidator.validateOverlap(newAppt, existingAppointments);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Employee is already booked');
    });

    it('should fail if there is room overlap', () => {
      const newAppt = {
        start_time: new Date(2026, 2, 20, 9, 30),
        end_time: new Date(2026, 2, 20, 10, 30),
        employee_id: 'e3', // Different employee
        room_id: 'r1'
      };
      const result = AppointmentValidator.validateOverlap(newAppt, existingAppointments);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Room is already booked');
    });

    it('should ignore canceled or no_show appointments when checking overlap', () => {
      const existingApptsWithCanceled: Appointment[] = [
        {
          id: '1', clinic_id: 'c1', client_id: 'cl1', service_id: 's1', employee_id: 'e1', room_id: null,
          start_time: new Date(2026, 2, 20, 10, 0), end_time: new Date(2026, 2, 20, 11, 0),
          status: 'canceled'
        }
      ];
      const newAppt = {
        start_time: new Date(2026, 2, 20, 10, 30),
        end_time: new Date(2026, 2, 20, 11, 30),
        employee_id: 'e1',
        room_id: null
      };
      const result = AppointmentValidator.validateOverlap(newAppt, existingApptsWithCanceled);
      expect(result.success).toBe(true);
    });
  });
});
