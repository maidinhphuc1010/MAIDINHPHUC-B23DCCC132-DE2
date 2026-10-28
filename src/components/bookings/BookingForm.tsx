import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { BookingFormData, FormErrors } from '../../types';
import { colors, spacing } from '../../theme';
import { AppButton, AppInput, AppText } from '../common';

export interface BookingFormValues {
  customerName: string;
  phone: string;
  date: string;
  startHour: string;
  hours: number;
}

export interface BookingFormProps {
  values: BookingFormValues;
  errors: FormErrors<BookingFormData>;
  onChange: <TKey extends keyof BookingFormValues>(field: TKey, value: BookingFormValues[TKey]) => void;
  onSubmit: () => void;
  disabled?: boolean;
  showSubmitButton?: boolean;
  submitTitle?: string;
  style?: StyleProp<ViewStyle>;
}

const RENTAL_HOURS = [1, 2, 3] as const;

function BookingForm({ values, errors, onChange, onSubmit, disabled = false, showSubmitButton = true, submitTitle = 'Đặt sân', style }: BookingFormProps) {
  return (
    <View style={[styles.container, style]}>
      <AppInput label="Tên khách" placeholder="Nhập tên khách" value={values.customerName} onChangeText={value => onChange('customerName', value)} error={errors.customerName} returnKeyType="next" />
      <AppInput label="Số điện thoại" placeholder="Nhập số điện thoại" value={values.phone} onChangeText={value => onChange('phone', value)} keyboardType="phone-pad" error={errors.phone} returnKeyType="next" />
      <AppInput label="Ngày đặt" placeholder="dd/mm/yyyy" value={values.date} onChangeText={value => onChange('date', value)} error={errors.date} />
      <AppInput label="Giờ bắt đầu (0–23)" placeholder="Ví dụ: 18" value={values.startHour} onChangeText={value => onChange('startHour', value)} keyboardType="number-pad" error={errors.startHour} />
      <View>
        <AppText variant="body" style={styles.hoursLabel}>Số giờ thuê</AppText>
        <View style={styles.hoursOptions}>
          {RENTAL_HOURS.map(hours => (
            <AppButton
              key={hours}
              title={`${hours} giờ`}
              variant={values.hours === hours ? 'primary' : 'outline'}
              accessibilityState={{ selected: values.hours === hours }}
              disabled={disabled}
              onPress={() => onChange('hours', hours)}
              style={styles.hoursButton}
            />
          ))}
        </View>
        {errors.hours ? <AppText accessibilityRole="alert" variant="caption" color={colors.error} style={styles.error}>{errors.hours}</AppText> : null}
      </View>
      {showSubmitButton ? <AppButton title={submitTitle} onPress={onSubmit} disabled={disabled} style={styles.submit} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  hoursLabel: { marginBottom: spacing.xs },
  hoursOptions: { flexDirection: 'row', gap: spacing.sm },
  hoursButton: { flex: 1, minHeight: 44, paddingHorizontal: spacing.xs },
  error: { marginTop: spacing.xxs },
  submit: { marginTop: spacing.xs },
});

export default BookingForm;
