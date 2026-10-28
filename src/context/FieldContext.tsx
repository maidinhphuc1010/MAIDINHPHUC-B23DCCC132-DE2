import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Booking, Field, FieldFormData } from '../types';
import * as bookingService from '../services/booking.service';
import * as fieldService from '../services/field.service';
import { loadData, saveData } from '../services/storage.service';

export interface FieldStoreValue {
  fields: Field[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  retryInitialization: () => Promise<void>;
  addField: (field: FieldFormData) => Promise<Field>;
  updateField: (id: string, changes: Partial<FieldFormData>) => Promise<Field>;
  deleteField: (id: string) => Promise<void>;
  getFieldById: (id: string) => Field | undefined;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  getBookingsByFieldId: (fieldId: string) => Booking[];
}

export const FieldContext = createContext<FieldStoreValue | undefined>(undefined);

export function FieldProvider({ children }: { children: React.ReactNode }) {
  const [fields, setFields] = useState<Field[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const dataRef = useRef({ fields, bookings });
  const readyRef = useRef(false);
  const writeQueueRef = useRef<Promise<void>>(Promise.resolve());

  const retryInitialization = useCallback(async () => {
    readyRef.current = false;
    setLoading(true);
    setError(null);
    setLoadAttempt(attempt => attempt + 1);
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const loaded = await loadData();
        const next = { fields: loaded.fields, bookings: loaded.bookings };
        if (mounted) {
          dataRef.current = next;
          setFields(next.fields);
          setBookings(next.bookings);
          readyRef.current = true;
        }
      } catch (cause) {
        if (mounted) {
          setError(cause instanceof Error ? cause.message : 'Không thể tải dữ liệu.');
          readyRef.current = false;
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [loadAttempt]);

  const commit = useCallback((next: { fields: Field[]; bookings: Booking[] }): Promise<void> => {
    dataRef.current = next;
    setFields(next.fields);
    setBookings(next.bookings);
    if (!readyRef.current) return Promise.resolve();

    const write = writeQueueRef.current.then(async () => {
      await saveData(next);
    });
    writeQueueRef.current = write.catch(() => undefined);
    return write.then(() => setError(null)).catch(cause => {
      const message = cause instanceof Error ? cause.message : 'Không thể lưu dữ liệu.';
      setError(message);
      throw cause;
    });
  }, []);

  const addField = useCallback(async (data: FieldFormData) => {
    if (!readyRef.current) throw new Error('Dữ liệu đang được tải.');
    const nextFields = fieldService.addField(dataRef.current.fields, data);
    const field = nextFields[nextFields.length - 1];
    await commit({ ...dataRef.current, fields: nextFields });
    return field;
  }, [commit]);

  const updateField = useCallback(async (id: string, changes: Partial<FieldFormData>) => {
    if (!readyRef.current) throw new Error('Dữ liệu đang được tải.');
    const nextFields = fieldService.updateField(dataRef.current.fields, id, changes);
    const updated = fieldService.getFieldById(nextFields, id);
    if (!updated) throw new Error('Không tìm thấy sân.');
    await commit({ ...dataRef.current, fields: nextFields });
    return updated;
  }, [commit]);

  const deleteField = useCallback(async (id: string) => {
    if (!readyRef.current) throw new Error('Dữ liệu đang được tải.');
    const nextFields = fieldService.deleteField(dataRef.current.fields, id, dataRef.current.bookings);
    await commit({ ...dataRef.current, fields: nextFields });
  }, [commit]);

  const getFieldById = useCallback((id: string) => fieldService.getFieldById(fields, id), [fields]);

  const addBooking = useCallback(async (data: Omit<Booking, 'id'>) => {
    if (!readyRef.current) throw new Error('Dữ liệu đang được tải.');
    const nextBookings = bookingService.addBooking(dataRef.current.fields, dataRef.current.bookings, data);
    const booking = nextBookings[nextBookings.length - 1];
    await commit({ ...dataRef.current, bookings: nextBookings });
    return booking;
  }, [commit]);

  const cancelBooking = useCallback(async (id: string) => {
    if (!readyRef.current) throw new Error('Dữ liệu đang được tải.');
    const nextBookings = bookingService.cancelBooking(dataRef.current.bookings, id);
    await commit({ ...dataRef.current, bookings: nextBookings });
  }, [commit]);

  const getBookingsByFieldId = useCallback((fieldId: string) => bookingService.getBookingsByFieldId(bookings, fieldId), [bookings]);

  const value = useMemo<FieldStoreValue>(() => ({
    fields, bookings, loading, error, retryInitialization, addField, updateField, deleteField,
    getFieldById, addBooking, cancelBooking, getBookingsByFieldId,
  }), [fields, bookings, loading, error, retryInitialization, addField, updateField, deleteField, getFieldById, addBooking, cancelBooking, getBookingsByFieldId]);

  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>;
}
