import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { calculateBookingTotal } from '../../utils/booking.utils';
import { formatCurrency, formatPricePerHour } from '../../utils/formatters';
import { borderRadius, colors, spacing } from '../../theme';
import { AppText } from '../common';

export interface BookingSummaryProps {
  pricePerHour: number;
  hours: number;
  style?: StyleProp<ViewStyle>;
}

function BookingSummary({ pricePerHour, hours, style }: BookingSummaryProps) {
  const total = calculateBookingTotal(pricePerHour, hours);
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <AppText variant="body" color={colors.textSecondary}>Giá thuê mỗi giờ</AppText>
        <AppText variant="body">{formatPricePerHour(pricePerHour)}</AppText>
      </View>
      <View style={[styles.row, styles.hoursRow]}>
        <AppText variant="body" color={colors.textSecondary}>Số giờ thuê</AppText>
        <AppText variant="body">{hours} giờ</AppText>
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <AppText variant="body" fontWeight="700">Thành tiền</AppText>
        <AppText variant="subtitle" color={colors.primaryDark}>{formatCurrency(total)}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, borderRadius: borderRadius.md, backgroundColor: colors.background },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  hoursRow: { marginTop: spacing.sm },
  totalRow: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});

export default BookingSummary;
