import { BOOKING_HOURS } from '../constants/app.constants';
import type { BookingFormData, Field, FieldFormData, FormErrors } from '../types';

export function validateFieldName(name: string, fields: readonly Field[] = [], excludeFieldId?: string): string | undefined {
  const normalizedName = name.trim().toLocaleLowerCase();
  if (!normalizedName) return 'Tên sân không được để trống.';

  const duplicate = fields.some(field =>
    field.id !== excludeFieldId && field.name.trim().toLocaleLowerCase() === normalizedName,
  );
  return duplicate ? 'Tên sân đã tồn tại.' : undefined;
}

export function validatePricePerHour(pricePerHour: number): string | undefined {
  return Number.isFinite(pricePerHour) && pricePerHour > 0
    ? undefined
    : 'Giá thuê phải là số lớn hơn 0.';
}

export function validateCustomerName(customerName: string): string | undefined {
  return customerName.trim() ? undefined : 'Tên khách hàng không được để trống.';
}

export function validatePhone(phone: string): string | undefined {
  return /^0\d{9}$/.test(phone) ? undefined : 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.';
}

export function validateDate(date: string): string | undefined {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  if (!match) return 'Ngày phải có định dạng dd/mm/yyyy.';

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const parsed = new Date(0);
  parsed.setUTCHours(0, 0, 0, 0);
  parsed.setUTCFullYear(year, month - 1, day);

  return parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
    ? undefined
    : 'Ngày không tồn tại trên lịch.';
}

export function validateStartHour(startHour: number): string | undefined {
  return Number.isInteger(startHour) &&
    startHour >= BOOKING_HOURS.startHour.min &&
    startHour <= BOOKING_HOURS.startHour.max
    ? undefined
    : `Giờ bắt đầu phải là số nguyên từ ${BOOKING_HOURS.startHour.min} đến ${BOOKING_HOURS.startHour.max}.`;
}

export function validateHours(hours: number): string | undefined {
  return Number.isInteger(hours) &&
    hours >= BOOKING_HOURS.rentalHours.min &&
    hours <= BOOKING_HOURS.rentalHours.max
    ? undefined
    : `Số giờ thuê phải là số nguyên từ ${BOOKING_HOURS.rentalHours.min} đến ${BOOKING_HOURS.rentalHours.max}.`;
}

export function validateBookingEndHour(startHour: number, hours: number): string | undefined {
  if (validateStartHour(startHour) || validateHours(hours)) return undefined;
  return startHour + hours <= BOOKING_HOURS.endHourMax
    ? undefined
    : `Giờ kết thúc không được vượt quá ${BOOKING_HOURS.endHourMax}:00.`;
}

export function validateFieldForm(data: FieldFormData, fields: readonly Field[] = [], excludeFieldId?: string): FormErrors<FieldFormData> {
  const errors: FormErrors<FieldFormData> = {};
  const nameError = validateFieldName(data.name, fields, excludeFieldId);
  const priceError = validatePricePerHour(data.pricePerHour);
  if (nameError) errors.name = nameError;
  if (priceError) errors.pricePerHour = priceError;
  return errors;
}

export function validateBookingForm(data: BookingFormData): FormErrors<BookingFormData> {
  const errors: FormErrors<BookingFormData> = {};
  const customerNameError = validateCustomerName(data.customerName);
  const phoneError = validatePhone(data.phone);
  const dateError = validateDate(data.date);
  const startHourError = validateStartHour(data.startHour);
  const hoursError = validateHours(data.hours);
  const endHourError = validateBookingEndHour(data.startHour, data.hours);

  if (customerNameError) errors.customerName = customerNameError;
  if (phoneError) errors.phone = phoneError;
  if (dateError) errors.date = dateError;
  if (startHourError) errors.startHour = startHourError;
  if (hoursError) errors.hours = hoursError;
  if (endHourError) errors.hours = endHourError;
  return errors;
}
