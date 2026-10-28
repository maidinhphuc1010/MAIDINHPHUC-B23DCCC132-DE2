import type { FieldStatus, FieldType } from '../types';

export const FIELD_TYPES = ['5 người', '7 người'] as const satisfies readonly FieldType[];

export const FIELD_STATUSES = ['Hoạt động', 'Bảo trì'] as const satisfies readonly FieldStatus[];

export const BOOKING_HOURS = {
  startHour: {
    min: 6,
    max: 22,
  },
  rentalHours: {
    min: 1,
    max: 3,
  },
  endHourMax: 23,
} as const;
