import type { Field, FieldFormData } from '../types';
import { validateFieldForm } from '../utils/validators';
import { generateId } from '../utils/id';

export class FieldServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FieldServiceError';
  }
}

export function getFieldById(fields: readonly Field[], id: string): Field | undefined {
  return fields.find(field => field.id === id);
}

export function addField(fields: readonly Field[], data: FieldFormData): Field[] {
  const errors = validateFieldForm(data, fields);
  if (Object.keys(errors).length > 0) throw new FieldServiceError(Object.values(errors).join(' '));
  const field: Field = { ...data, id: generateId() };
  return [...fields, field];
}

export function updateField(fields: readonly Field[], id: string, changes: Partial<FieldFormData>): Field[] {
  const existing = getFieldById(fields, id);
  if (!existing) throw new FieldServiceError('Không tìm thấy sân.');
  const updated: Field = { ...existing, ...changes, id };
  const errors = validateFieldForm(updated, fields, id);
  if (Object.keys(errors).length > 0) throw new FieldServiceError(Object.values(errors).join(' '));
  return fields.map(field => field.id === id ? updated : field);
}

export function deleteField(fields: readonly Field[], id: string, bookings: readonly { fieldId: string }[]): Field[] {
  if (!getFieldById(fields, id)) throw new FieldServiceError('Không tìm thấy sân.');
  if (bookings.some(booking => booking.fieldId === id)) {
    throw new FieldServiceError('Không thể xóa sân đang có lượt đặt.');
  }
  return fields.filter(field => field.id !== id);
}
