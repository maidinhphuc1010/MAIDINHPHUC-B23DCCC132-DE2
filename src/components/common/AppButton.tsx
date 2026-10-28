import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

export interface AppButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const variantStyles = {
  primary: { backgroundColor: colors.primary, borderColor: colors.primary, textColor: colors.surface },
  secondary: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight, textColor: colors.primaryDark },
  danger: { backgroundColor: colors.error, borderColor: colors.error, textColor: colors.surface },
  outline: { backgroundColor: colors.surface, borderColor: colors.border, textColor: colors.text },
} satisfies Record<ButtonVariant, { backgroundColor: string; borderColor: string; textColor: string }>;

function AppButton({ title, variant = 'primary', disabled = false, loading = false, style, ...pressableProps }: AppButtonProps) {
  const palette = variantStyles[variant];
  const unavailable = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: unavailable ? colors.border : palette.backgroundColor, borderColor: unavailable ? colors.border : palette.borderColor },
        pressed && !unavailable && styles.pressed,
        style,
      ]}
      {...pressableProps}
    >
      {loading ? <ActivityIndicator color={colors.textSecondary} /> : (
        <Text style={[styles.label, { color: unavailable ? colors.textDisabled : palette.textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderWidth: 1, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  label: { ...typography.bodyEmphasis, textAlign: 'center' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});

export default AppButton;
