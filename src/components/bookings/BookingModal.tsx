import React, { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { BookingFormData, FormErrors } from '../../types';
import { validateBookingForm } from '../../utils/validators';
import { colors, spacing } from '../../theme';
import { AppButton, AppModal, AppText } from '../common';
import BookingForm, { type BookingFormProps, type BookingFormValues } from './BookingForm';
import BookingSummary from './BookingSummary';

export interface BookingModalProps {
  visible: boolean;
  fieldId: string;
  pricePerHour: number;
  onClose: () => void;
  onSubmit: (booking: BookingFormData) => void | string | Promise<void | string>;
  loading?: boolean;
  bookingError?: string | null;
  initialValues?: Partial<BookingFormValues>;
  style?: StyleProp<ViewStyle>;
}

const defaultValues: BookingFormValues = {
  customerName: '',
  phone: '',
  date: '',
  startHour: '',
  hours: 1,
};

function BookingModal({ visible, fieldId, pricePerHour, onClose, onSubmit, loading = false, bookingError, initialValues, style }: BookingModalProps) {
  const [values, setValues] = useState<BookingFormValues>(() => ({ ...defaultValues, ...initialValues }));
  const [errors, setErrors] = useState<FormErrors<BookingFormData>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setValues({ ...defaultValues, ...initialValues });
      setErrors({});
      setSubmitError(null);
      setSubmitting(false);
    }
  }, [visible, initialValues]);

  const changeValue: BookingFormProps['onChange'] = (field, value) => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    const data: BookingFormData = {
      fieldId,
      customerName: values.customerName,
      phone: values.phone,
      date: values.date,
      startHour: Number(values.startHour),
      hours: values.hours,
    };
    const validationErrors = validateBookingForm(data);
    if (!values.startHour.trim() || !Number.isFinite(data.startHour)) {
      validationErrors.startHour = 'Giờ bắt đầu phải là số nguyên từ 6 đến 22.';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await onSubmit(data);
      if (typeof result === 'string' && result) setSubmitError(result);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : 'Không thể tạo lượt đặt. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const busy = loading || submitting;
  const visibleError = bookingError ?? submitError;

  return (
    <AppModal visible={visible} onClose={onClose} title="Đặt sân" style={[styles.modal, style]}>
      <View style={styles.content}>
        <BookingForm values={values} errors={errors} onChange={changeValue} onSubmit={handleSubmit} disabled={busy} showSubmitButton={false} />
        <BookingSummary pricePerHour={pricePerHour} hours={values.hours} />
        {visibleError ? <AppText accessibilityRole="alert" variant="body" color={colors.error} style={styles.error}>{visibleError}</AppText> : null}
        <View style={styles.actions}>
          <AppButton title="Đóng" variant="outline" onPress={onClose} disabled={busy} style={styles.actionButton} />
          <AppButton title="Đặt sân" onPress={handleSubmit} loading={busy} style={styles.actionButton} />
        </View>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  modal: { maxHeight: '92%' },
  content: { gap: spacing.md },
  error: { padding: spacing.sm, borderRadius: 8, backgroundColor: colors.errorBackground },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: { flex: 1 },
});

export default BookingModal;
