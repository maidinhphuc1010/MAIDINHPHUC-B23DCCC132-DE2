export type FieldType = '5 người' | '7 người';

export type FieldStatus = 'Hoạt động' | 'Bảo trì';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  pricePerHour: number;
  status: FieldStatus;
}

export type FieldFormData = Omit<Field, 'id'>;
