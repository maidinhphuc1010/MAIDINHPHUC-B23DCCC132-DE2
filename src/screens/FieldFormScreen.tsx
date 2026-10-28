import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import type { FieldFormData } from '../types';
import { useFields } from '../hooks/useFields';
import { spacing } from '../theme';
import { AppScreen, AppText } from '../components/common';
import { FieldForm } from '../components/fields';

interface Props { fieldId?: string; onBack: () => void; }

export default function FieldFormScreen({ fieldId, onBack }: Props) {
  const { fields, loading, addField, updateField } = useFields();
  const field = fields.find(candidate => candidate.id === fieldId);
  if (loading) return <AppScreen><AppText variant="body">Đang tải dữ liệu sân…</AppText></AppScreen>;
  if (fieldId && !field) return <AppScreen><AppText variant="title">Không tìm thấy sân</AppText></AppScreen>;
  const submit = async (data: FieldFormData) => {
    try {
      if (field) await updateField(field.id, data);
      else await addField(data);
      onBack();
    } catch (cause) {
      Alert.alert('Không thể lưu sân', cause instanceof Error ? cause.message : 'Vui lòng thử lại.');
      throw cause;
    }
  };
  return (
    <AppScreen scroll keyboardAvoiding contentContainerStyle={styles.content}>
      <AppText variant="title" style={styles.title}>{field ? 'Sửa thông tin sân' : 'Thêm sân mới'}</AppText>
      <FieldForm key={field?.id ?? 'new-field'} initialValues={field} fields={fields} mode={field ? 'edit' : 'create'} onSubmit={submit} onCancel={onBack} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({ content: { gap: spacing.md }, title: { marginBottom: spacing.xs } });
