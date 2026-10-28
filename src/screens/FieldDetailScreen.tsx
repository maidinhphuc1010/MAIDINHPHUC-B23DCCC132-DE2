import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import type { Booking, Field } from '../types';
import { useBookings } from '../hooks/useBookings';
import { colors, spacing } from '../theme';
import { AppButton, AppCard, AppScreen, AppText, EmptyState, Loading } from '../components/common';
import { BookingCard, BookingModal } from '../components/bookings';
import { FieldStatusBadge } from '../components/fields';
import { formatPricePerHour } from '../utils/formatters';

interface Props { field: Field | undefined; onBack: () => void; }

export default function FieldDetailScreen({ field, onBack }: Props) {
  const { loading, error, addBooking, cancelBooking, getBookingsByFieldId } = useBookings();
  const [modalVisible, setModalVisible] = React.useState(false);
  if (!field) {
    return <AppScreen><AppText variant="title">Không tìm thấy sân</AppText><AppButton title="Quay lại" onPress={onBack} /></AppScreen>;
  }
  const fieldBookings = getBookingsByFieldId(field.id);
  const confirmCancel = (booking: Booking) => Alert.alert('Hủy lượt đặt', `Hủy lượt đặt của ${booking.customerName}?`, [
    { text: 'Không', style: 'cancel' },
    { text: 'Hủy lượt', style: 'destructive', onPress: () => {
      cancelBooking(booking.id).catch(cause => Alert.alert('Không thể hủy', cause instanceof Error ? cause.message : 'Vui lòng thử lại.'));
    } },
  ]);
  return (
    <AppScreen style={styles.screen}>
      <View style={styles.top}><AppButton title="‹ Quay lại" variant="outline" onPress={onBack} /><AppText variant="title" style={styles.title}>Chi tiết sân</AppText></View>
      <AppCard style={styles.info}>
        <View style={styles.infoRow}><AppText variant="subtitle">{field.name}</AppText><FieldStatusBadge status={field.status} /></View>
        <AppText variant="body" color={colors.textSecondary}>{field.type}</AppText>
        <AppText variant="body" color={colors.primaryDark} fontWeight="700">{formatPricePerHour(field.pricePerHour)}</AppText>
        <AppButton title="Đặt sân" disabled={field.status === 'Bảo trì' || loading} onPress={() => setModalVisible(true)} />
      </AppCard>
      <AppText variant="subtitle" style={styles.bookingsTitle}>Lịch đặt ({fieldBookings.length})</AppText>
      {loading ? <Loading message="Đang tải lịch đặt…" /> : error ? <AppText accessibilityRole="alert" color={colors.error}>{error}</AppText> : fieldBookings.length === 0 ? (
        <EmptyState message="Sân này chưa có lượt đặt nào." />
      ) : (
        <FlatList data={fieldBookings} keyExtractor={booking => booking.id} renderItem={({ item }) => <BookingCard booking={item} field={field} onCancel={confirmCancel} />} ItemSeparatorComponent={Separator} contentContainerStyle={styles.list} />
      )}
      <BookingModal visible={modalVisible} fieldId={field.id} pricePerHour={field.pricePerHour} onClose={() => setModalVisible(false)} onSubmit={async data => { await addBooking(data); setModalVisible(false); }} />
    </AppScreen>
  );
}
function Separator() { return <View style={styles.separator} />; }
const styles = StyleSheet.create({
  screen: { paddingBottom: 0 },
  top: { gap: spacing.sm, marginBottom: spacing.md },
  title: { marginTop: spacing.xs },
  info: { gap: spacing.sm, marginBottom: spacing.lg },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  bookingsTitle: { marginBottom: spacing.sm },
  list: { paddingBottom: spacing.xl },
  separator: { height: spacing.md },
});
