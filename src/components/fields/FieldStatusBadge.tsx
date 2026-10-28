import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { FieldStatus } from '../../types';
import { borderRadius, colors, spacing } from '../../theme';
import AppText from '../common/AppText';

export interface FieldStatusBadgeProps {
  status: FieldStatus;
  style?: StyleProp<ViewStyle>;
}

function FieldStatusBadge({ status, style }: FieldStatusBadgeProps) {
  const active = status === 'Hoạt động';
  return (
    <View style={[styles.badge, { backgroundColor: active ? colors.successBackground : colors.maintenanceBackground }, style]}>
      <View style={[styles.dot, { backgroundColor: active ? colors.success : colors.maintenance }]} />
      <AppText variant="caption" color={active ? colors.success : colors.maintenance} fontWeight="600">{status}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: borderRadius.pill },
  dot: { width: 7, height: 7, marginRight: spacing.xs, borderRadius: borderRadius.pill },
});

export default FieldStatusBadge;
