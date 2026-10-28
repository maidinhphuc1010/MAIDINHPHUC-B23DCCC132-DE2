import { useContext } from 'react';
import { BookingContext } from '../context/BookingContext';

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBookings phải được sử dụng bên trong BookingProvider.');
  return {
    bookings: context.bookings,
    loading: context.loading,
    error: context.error,
    retryInitialization: context.retryInitialization,
    addBooking: context.addBooking,
    cancelBooking: context.cancelBooking,
    getBookingsByFieldId: context.getBookingsByFieldId,
  };
}
