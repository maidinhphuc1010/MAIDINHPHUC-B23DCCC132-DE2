import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { FIELD_TYPES } from '../../constants/app.constants';
import type { FieldType } from '../../types';
import { borderRadius, colors, spacing } from '../../theme';
import AppText from '../common/AppText';

export interface FieldTypeSelectorProps {
  value: FieldType;
  onChange: (value: FieldType) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

function FieldTypeSelector({ value, onChange, label = 'Loại sân', style }: FieldTypeSelectorProps) {
  return (
    <View style={style}>
      <AppText variant="body" style={styles.label}>{label}</AppText>
      <View style={styles.options}>
        {FIELD_TYPES.map(type => {
          const selected = type === value;
          return (
            <Pressable
              key={type}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(type)}
              style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}
            >
              <AppText variant="body" color={selected ? colors.primary : colors.textSecondary} fontWeight={selected ? '600' : '400'}>{type}</AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.xs },
  options: { flexDirection: 'row', gap: spacing.sm },
  option: { flex: 1, minHeight: 48, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, backgroundColor: colors.surface },
  selected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  pressed: { opacity: 0.78 },
});

export default FieldTypeSelector;
