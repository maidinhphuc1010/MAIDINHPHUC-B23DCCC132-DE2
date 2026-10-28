import type { Booking } from '../types';

export function calculateBookingTotal(pricePerHour: number, hours: number): number {
  return pricePerHour * hours;
}

export function hasBookingConflict(bookings: readonly Booking[], newBooking: Booking): boolean {
  const newStart = newBooking.startHour;
  const newEnd = newStart + newBooking.hours;

  return bookings.some(booking => {
    if (
      booking.id === newBooking.id ||
      booking.fieldId !== newBooking.fieldId ||
      booking.date !== newBooking.date
    ) {
      return false;
    }

    const existingStart = booking.startHour;
    const existingEnd = existingStart + booking.hours;
    return newStart < existingEnd && newEnd > existingStart;
  });
}

export function filterBookingsByFieldId(bookings: readonly Booking[], fieldId: string): Booking[] {
  return bookings.filter(booking => booking.fieldId === fieldId);
}
