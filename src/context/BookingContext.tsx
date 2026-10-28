import React, { createContext, useContext, useMemo } from 'react';
import type { Booking } from '../types';
import { FieldContext, type FieldStoreValue } from './FieldContext';

export interface BookingContextValue {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  addBooking: FieldStoreValue['addBooking'];
  cancelBooking: FieldStoreValue['cancelBooking'];
  getBookingsByFieldId: FieldStoreValue['getBookingsByFieldId'];
}

export const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const fieldStore = useContext(FieldContext);
  if (!fieldStore) throw new Error('BookingProvider phải được bọc bên trong FieldProvider.');

  const value = useMemo<BookingContextValue>(() => ({
    bookings: fieldStore.bookings,
    loading: fieldStore.loading,
    error: fieldStore.error,
    addBooking: fieldStore.addBooking,
    cancelBooking: fieldStore.cancelBooking,
    getBookingsByFieldId: fieldStore.getBookingsByFieldId,
  }), [fieldStore.bookings, fieldStore.loading, fieldStore.error, fieldStore.addBooking, fieldStore.cancelBooking, fieldStore.getBookingsByFieldId]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
