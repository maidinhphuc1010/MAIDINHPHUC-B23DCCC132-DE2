import React, { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Field, FieldFormData, FieldStatus } from '../../types';
import { FIELD_STATUSES } from '../../constants/app.constants';
import { validateFieldForm } from '../../utils/validators';
import { spacing } from '../../theme';
import { AppButton, AppInput, AppText } from '../common';
import FieldTypeSelector from './FieldTypeSelector';

export interface FieldFormProps {
  initialValues?: Field;
  fields?: readonly Field[];
  mode?: 'create' | 'edit';
  onSubmit: (data: FieldFormData) => void | Promise<void>;
  onCancel: () => void;
  style?: StyleProp<ViewStyle>;
}

interface FieldFormValues {
  name: string;
  type: Field['type'];
  pricePerHour: string;
  status: FieldStatus;
}

function getInitialValues(field?: Field): FieldFormValues {
  return field
    ? { name: field.name, type: field.type, pricePerHour: String(field.pricePerHour), status: field.status }
    : { name: '', type: '5 người', pricePerHour: '', status: 'Hoạt động' };
}

function FieldForm({ initialValues, fields = [], mode = initialValues ? 'edit' : 'create', onSubmit, onCancel, style }: FieldFormProps) {
  const [values, setValues] = useState<FieldFormValues>(() => getInitialValues(initialValues));
  const [errors, setErrors] = useState<{ name?: string; pricePerHour?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues(getInitialValues(initialValues));
    setErrors({});
  }, [initialValues]);

  const setField = <TKey extends keyof FieldFormValues>(key: TKey, value: FieldFormValues[TKey]) => {
    setValues(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const price = Number(values.pricePerHour.trim());
    const data: FieldFormData = { name: values.name, type: values.type, pricePerHour: price, status: values.status };
    const validationErrors = validateFieldForm(data, fields, mode === 'edit' ? initialValues?.id : undefined);
    if (!values.pricePerHour.trim() || !Number.isFinite(price)) {
      validationErrors.pricePerHour = 'Giá thuê phải là số lớn hơn 0.';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <AppInput
        label="Tên sân"
        placeholder="Nhập tên sân"
        value={values.name}
        onChangeText={value => setField('name', value)}
        error={errors.name}
        returnKeyType="next"
      />
      <AppInput
        label="Giá thuê mỗi giờ"
        placeholder="Ví dụ: 300000"
        value={values.pricePerHour}
        onChangeText={value => setField('pricePerHour', value)}
        keyboardType="numeric"
        error={errors.pricePerHour}
      />
      <FieldTypeSelector value={values.type} onChange={value => setField('type', value)} />
      <View>
        <AppText variant="body" style={styles.statusLabel}>Trạng thái</AppText>
        <View style={styles.statusOptions}>
          {FIELD_STATUSES.map(status => {
            const selected = values.status === status;
            return (
              <AppButton
                key={status}
                title={status}
                variant={selected ? 'primary' : 'outline'}
                accessibilityState={{ selected }}
                onPress={() => setField('status', status)}
                style={styles.statusButton}
              />
            );
          })}
        </View>
      </View>
      <View style={styles.actions}>
        <AppButton title="Hủy" variant="outline" onPress={onCancel} disabled={submitting} style={styles.actionButton} />
        <AppButton title="Lưu" onPress={handleSubmit} loading={submitting} style={styles.actionButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  statusLabel: { marginBottom: spacing.xs },
  statusOptions: { flexDirection: 'row', gap: spacing.sm },
  statusButton: { flex: 1, minHeight: 44, paddingHorizontal: spacing.xs },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.xs },
  actionButton: { flex: 1 },
});

export default FieldForm;
