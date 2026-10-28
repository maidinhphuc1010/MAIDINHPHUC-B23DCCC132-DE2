import React, { useMemo } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import type { Field } from '../types';
import { useFields } from '../hooks/useFields';
import { colors, spacing } from '../theme';
import { AppButton, AppScreen, AppText, EmptyState, Loading } from '../components/common';
import { FieldCard } from '../components/fields';

interface Props {
  onAdd: () => void;
  onEdit: (field: Field) => void;
  onOpen: (field: Field) => void;
}

export default function FieldListScreen({ onAdd, onEdit, onOpen }: Props) {
  const { fields, activeCount, loading, error, deleteField } = useFields();
  const sortedFields = useMemo(() => fields, [fields]);

  const confirmDelete = (field: Field) => Alert.alert(
    'Xóa sân', `Bạn có chắc muốn xóa ${field.name}?`, [
      { text: 'Không', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => {
        deleteField(field.id).catch(cause => Alert.alert('Không thể xóa sân', cause instanceof Error ? cause.message : 'Vui lòng thử lại.'));
      } },
    ],
  );

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.header}>
        <View>
          <AppText variant="title">Quản lý sân</AppText>
          <AppText variant="body" color={colors.textSecondary}>{activeCount}/{fields.length} sân hoạt động</AppText>
        </View>
        <AppButton title="+ Thêm sân" onPress={onAdd} />
      </View>
      {error ? <AppText accessibilityRole="alert" color={colors.error}>{error}</AppText> : null}
      {loading ? <Loading message="Đang tải danh sách sân…" /> : fields.length === 0 ? (
        <EmptyState title="Chưa có sân" message="Thêm sân đầu tiên để bắt đầu quản lý." action={<AppButton title="+ Thêm sân" onPress={onAdd} />} />
      ) : (
        <FlatList
          data={sortedFields}
          keyExtractor={field => field.id}
          renderItem={({ item }) => <FieldCard field={item} onPress={onOpen} onEdit={onEdit} onDelete={confirmDelete} style={styles.card} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={Separator}
          initialNumToRender={8}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </AppScreen>
  );
}

function Separator() { return <View style={styles.separator} />; }

const styles = StyleSheet.create({
  screen: { paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  list: { paddingBottom: spacing.xl },
  separator: { height: spacing.md },
  card: { width: '100%' },
});
