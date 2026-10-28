export interface Booking {
  id: string;
  fieldId: string;
  customerName: string;
  phone: string;
  date: string;
  startHour: number;
  hours: number;
}

export type BookingFormData = Omit<Booking, 'id'>;
