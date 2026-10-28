import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';
import AppText from './AppText';

export interface EmptyStateProps {
  message: string;
  title?: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function EmptyState({ message, title, action, style }: EmptyStateProps) {
  return (
    <View accessibilityRole="text" style={[styles.container, style]}>
      {title ? <AppText variant="subtitle" align="center" style={styles.title}>{title}</AppText> : null}
      <AppText variant="body" color={colors.textSecondary} align="center">{message}</AppText>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 160, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { marginBottom: spacing.xs },
  action: { marginTop: spacing.md },
});

export default EmptyState;
