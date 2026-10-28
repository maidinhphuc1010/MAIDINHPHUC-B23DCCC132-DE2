import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_BOOKINGS, MOCK_FIELDS } from '../constants/mockData';
import STORAGE_KEYS from '../constants/storage.keys';
import type { Booking, Field } from '../types';

export interface AppDataSnapshot {
  fields: Field[];
  bookings: Booking[];
}

export interface LoadDataResult extends AppDataSnapshot {
  initialized: boolean;
  recovered: boolean;
}

interface StoredSnapshot extends AppDataSnapshot {
  version: 1;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isField(value: unknown): value is Field {
  if (!isRecord(value)) return false;
  return isString(value.id) && isString(value.name) &&
    (value.type === '5 người' || value.type === '7 người') &&
    typeof value.pricePerHour === 'number' &&
    (value.status === 'Hoạt động' || value.status === 'Bảo trì');
}

function isBooking(value: unknown): value is Booking {
  if (!isRecord(value)) return false;
  return isString(value.id) && isString(value.fieldId) &&
    isString(value.customerName) && isString(value.phone) && isString(value.date) &&
    typeof value.startHour === 'number' && typeof value.hours === 'number';
}

function parseSnapshot(raw: string): AppDataSnapshot | undefined {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed.fields) || !Array.isArray(parsed.bookings)) return undefined;
    if (!parsed.fields.every(isField) || !parsed.bookings.every(isBooking)) return undefined;
    return { fields: parsed.fields, bookings: parsed.bookings };
  } catch {
    return undefined;
  }
}

function parseLegacyArray<T>(raw: string | null, isItem: (value: unknown) => value is T): T[] | undefined {
  if (raw === null) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isItem) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export async function loadData(): Promise<LoadDataResult> {
  const [snapshotRaw, fieldsRaw, bookingsRaw] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEYS.snapshot),
    AsyncStorage.getItem(STORAGE_KEYS.fields),
    AsyncStorage.getItem(STORAGE_KEYS.bookings),
  ]);

  if (snapshotRaw !== null) {
    const snapshot = parseSnapshot(snapshotRaw);
    if (snapshot) return { ...snapshot, initialized: true, recovered: false };
    // A damaged snapshot is never treated as first launch; recover legacy data or safely reseed missing data.
    const fields = parseLegacyArray(fieldsRaw, isField);
    const bookings = parseLegacyArray(bookingsRaw, isBooking);
    const recoveredData = {
      fields: fields ?? [...MOCK_FIELDS],
      bookings: bookings ?? [...MOCK_BOOKINGS],
    };
    await saveData(recoveredData);
    return { ...recoveredData, initialized: true, recovered: true };
  }

  const legacyFields = parseLegacyArray(fieldsRaw, isField);
  const legacyBookings = parseLegacyArray(bookingsRaw, isBooking);
  const initialized = fieldsRaw !== null || bookingsRaw !== null;

  if (initialized) {
    const migrated = {
      fields: legacyFields ?? [...MOCK_FIELDS],
      bookings: legacyBookings ?? [...MOCK_BOOKINGS],
    };
    await saveData(migrated);
    return { ...migrated, initialized: true, recovered: legacyFields === undefined || legacyBookings === undefined };
  }

  const initial = { fields: [...MOCK_FIELDS], bookings: [...MOCK_BOOKINGS] };
  await saveData(initial);
  return { ...initial, initialized: false, recovered: false };
}

export async function saveData(snapshot: AppDataSnapshot): Promise<void> {
  const stored: StoredSnapshot = { version: 1, fields: snapshot.fields, bookings: snapshot.bookings };
  await AsyncStorage.setItem(STORAGE_KEYS.snapshot, JSON.stringify(stored));
}
