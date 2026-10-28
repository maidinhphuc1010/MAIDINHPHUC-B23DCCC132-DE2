import type { Booking, Field } from '../types';

export const MOCK_FIELDS: Field[] = [
  {
    id: 'field-001',
    name: 'Sân A1',
    type: '5 người',
    pricePerHour: 250000,
    status: 'Hoạt động',
  },
  {
    id: 'field-002',
    name: 'Sân A2',
    type: '5 người',
    pricePerHour: 280000,
    status: 'Hoạt động',
  },
  {
    id: 'field-003',
    name: 'Sân B1',
    type: '7 người',
    pricePerHour: 450000,
    status: 'Bảo trì',
  },
  {
    id: 'field-004',
    name: 'Sân B2',
    type: '7 người',
    pricePerHour: 480000,
    status: 'Hoạt động',
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking-001',
    fieldId: 'field-001',
    customerName: 'Nguyễn Minh Anh',
    phone: '0912345678',
    date: '15/11/2026',
    startHour: 8,
    hours: 2,
  },
  {
    id: 'booking-002',
    fieldId: 'field-001',
    customerName: 'Trần Quốc Bảo',
    phone: '0987654321',
    date: '15/11/2026',
    startHour: 11,
    hours: 1,
  },
  {
    id: 'booking-003',
    fieldId: 'field-004',
    customerName: 'Lê Hoàng Nam',
    phone: '0901234567',
    date: '16/11/2026',
    startHour: 19,
    hours: 3,
  },
];
