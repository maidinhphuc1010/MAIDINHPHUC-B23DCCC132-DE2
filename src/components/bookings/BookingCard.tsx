import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Booking, Field } from '../../types';
import { calculateBookingTotal } from '../../utils/booking.utils';
import { formatCurrency, formatHourRange } from '../../utils/formatters';
import { colors, spacing } from '../../theme';
import { AppButton, AppCard, AppText } from '../common';

export interface BookingCardProps {
  booking: Booking;
  field: Field;
  onCancel: (booking: Booking) => void;
  style?: StyleProp<ViewStyle>;
}

function BookingCard({ booking, field, onCancel, style }: BookingCardProps) {
  return (
    <AppCard style={[styles.card, style]}>
      <View style={styles.header}>
        <AppText variant="subtitle" style={styles.name}>{booking.customerName}</AppText>
        <AppText variant="body" color={colors.textSecondary}>{booking.phone}</AppText>
      </View>
      <View style={styles.details}>
        <AppText variant="body">Ngày đặt: {booking.date}</AppText>
        <AppText variant="body">Giờ: {formatHourRange(booking.startHour, booking.hours)}</AppText>
        <AppText variant="caption" color={colors.textSecondary}>{field.name}</AppText>
      </View>
      <View style={styles.footer}>
        <View>
          <AppText variant="caption" color={colors.textSecondary}>Tổng tiền</AppText>
          <AppText variant="body" color={colors.primaryDark} fontWeight="700">{formatCurrency(calculateBookingTotal(field.pricePerHour, booking.hours))}</AppText>
        </View>
        <AppButton title="Hủy đặt" variant="danger" onPress={() => onCancel(booking)} style={styles.cancelButton} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { gap: spacing.xxs },
  name: { flexShrink: 1 },
  details: { gap: spacing.xs },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  cancelButton: { minHeight: 40, paddingHorizontal: spacing.md },
});

export default BookingCard;
