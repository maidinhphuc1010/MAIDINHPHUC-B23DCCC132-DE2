import React from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';
import AppText from './AppText';

export interface LoadingProps {
  message?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  fullScreen?: boolean;
}

function Loading({ message, color = colors.primary, style, fullScreen = false }: LoadingProps) {
  return (
    <View accessibilityRole="progressbar" style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size="large" color={color} />
      {message ? <AppText variant="body" color={colors.textSecondary} style={styles.message}>{message}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 96, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  fullScreen: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.background, zIndex: 1 },
  message: { marginTop: spacing.sm, textAlign: 'center' },
});

export default Loading;
