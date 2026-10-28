import type { Booking } from '../src/types';
import { hasBookingConflict } from '../src/utils/booking.utils';
import { validateBookingForm } from '../src/utils/validators';

const existing: Booking = {
  id: 'existing', fieldId: 'field-1', customerName: 'Khách A', phone: '0912345678',
  date: '15/11/2026', startHour: 17, hours: 2,
};

function booking(startHour: number, hours: number): Booking {
  return { ...existing, id: 'next', startHour, hours };
}

test('detects overlapping booking and allows adjacent time slots', () => {
  expect(hasBookingConflict([existing], booking(18, 2))).toBe(true);
  expect(hasBookingConflict([existing], booking(19, 1))).toBe(false);
  expect(hasBookingConflict([existing], { ...booking(18, 1), fieldId: 'other' })).toBe(false);
  expect(hasBookingConflict([existing], { ...booking(18, 1), date: '16/11/2026' })).toBe(false);
});

test('validates customer phone, calendar date, hours and end time', () => {
  const valid = { fieldId: 'field-1', customerName: 'Khách B', phone: '0901234567', date: '15/11/2026', startHour: 20, hours: 3 };
  expect(validateBookingForm(valid)).toEqual({});
  expect(validateBookingForm({ ...valid, phone: '123' }).phone).toBeDefined();
  expect(validateBookingForm({ ...valid, date: '31/02/2026' }).date).toBeDefined();
  expect(validateBookingForm({ ...valid, startHour: 22, hours: 2 }).hours).toBeDefined();
});
