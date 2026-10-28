import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';
import AppText from './AppText';

export interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function AppHeader({ title, onBack, rightAction, style }: AppHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.side}>
        {onBack ? <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" hitSlop={8} onPress={onBack} style={styles.back}><AppText variant="subtitle" color={colors.primary}>‹</AppText></Pressable> : null}
      </View>
      <AppText variant="subtitle" numberOfLines={1} align="center" style={styles.title}>{title}</AppText>
      <View style={[styles.side, styles.right]}>{rightAction}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 56, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface },
  side: { width: 44, minHeight: 44, justifyContent: 'center' },
  back: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  title: { flex: 1 },
  right: { alignItems: 'flex-end' },
});

export default AppHeader;
