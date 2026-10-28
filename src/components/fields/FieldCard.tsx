import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Field } from '../../types';
import { formatPricePerHour } from '../../utils/formatters';
import { borderRadius, colors, spacing } from '../../theme';
import { AppButton, AppCard, AppText } from '../common';
import FieldStatusBadge from './FieldStatusBadge';

export interface FieldCardProps {
  field: Field;
  onPress?: (field: Field) => void;
  onEdit?: (field: Field) => void;
  onDelete?: (field: Field) => void;
  style?: StyleProp<ViewStyle>;
}

function FieldCard({ field, onPress, onEdit, onDelete, style }: FieldCardProps) {
  return (
    <AppCard
      accessibilityLabel={`${field.name}, ${field.type}, ${formatPricePerHour(field.pricePerHour)}, ${field.status}`}
      onPress={onPress ? () => onPress(field) : undefined}
      style={[styles.card, style]}
    >
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <AppText variant="subtitle" numberOfLines={1}>{field.name}</AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.type}>{field.type}</AppText>
        </View>
        <FieldStatusBadge status={field.status} />
      </View>
      <AppText variant="body" color={colors.primaryDark} fontWeight="700" style={styles.price}>{formatPricePerHour(field.pricePerHour)}</AppText>
      {(onEdit || onDelete) ? (
        <View style={styles.actions}>
          {onEdit ? <AppButton title="Sửa" variant="outline" onPress={() => onEdit(field)} style={styles.actionButton} /> : null}
          {onDelete ? <AppButton title="Xóa" variant="danger" onPress={() => onDelete(field)} style={styles.actionButton} /> : null}
        </View>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: borderRadius.lg },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  nameBlock: { flex: 1 },
  type: { marginTop: spacing.xxs },
  price: { marginTop: spacing.md },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.md, gap: spacing.sm },
  actionButton: { minWidth: 88, minHeight: 40, paddingVertical: spacing.xxs },
});

export default FieldCard;
