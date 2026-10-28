import React from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../../theme';

export interface AppCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: PressableProps['onPress'];
  accessibilityLabel?: string;
}

function AppCard({ children, style, onPress, accessibilityLabel }: AppCardProps) {
  if (onPress) {
    return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}>{children}</Pressable>;
  }
  return <View accessibilityLabel={accessibilityLabel} style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { padding: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.surface, ...shadows.sm },
  pressed: { opacity: 0.88 },
});

export default AppCard;
