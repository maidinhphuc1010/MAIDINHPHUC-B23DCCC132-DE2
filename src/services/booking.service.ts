import type { Booking, BookingFormData, Field } from '../types';
import { filterBookingsByFieldId, hasBookingConflict } from '../utils/booking.utils';
import { generateId } from '../utils/id';
import { validateBookingForm } from '../utils/validators';

export class BookingServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingServiceError';
  }
}

export function addBooking(
  fields: readonly Field[],
  bookings: readonly Booking[],
  data: BookingFormData,
): Booking[] {
  const field = fields.find(candidate => candidate.id === data.fieldId);
  if (!field) throw new BookingServiceError('Không tìm thấy sân.');
  if (field.status === 'Bảo trì') throw new BookingServiceError('Không thể đặt sân đang bảo trì.');

  const errors = validateBookingForm(data);
  if (Object.keys(errors).length > 0) throw new BookingServiceError(Object.values(errors).join(' '));

  const booking: Booking = { ...data, id: generateId() };
  if (hasBookingConflict(bookings, booking)) {
    throw new BookingServiceError('Khung giờ này đã có lượt đặt.');
  }
  return [...bookings, booking];
}

export function cancelBooking(bookings: readonly Booking[], id: string): Booking[] {
  if (!bookings.some(booking => booking.id === id)) throw new BookingServiceError('Không tìm thấy lượt đặt.');
  return bookings.filter(booking => booking.id !== id);
}

export function getBookingsByFieldId(bookings: readonly Booking[], fieldId: string): Booking[] {
  return filterBookingsByFieldId(bookings, fieldId);
}
