import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View, type ScrollViewProps, type StatusBarStyle, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

export interface AppScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  statusBarStyle?: StatusBarStyle;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle' | 'children'>;
}

function AppScreen({ children, scroll = false, keyboardAvoiding = false, statusBarStyle = 'dark-content', style, contentContainerStyle, scrollViewProps }: AppScreenProps) {
  const content = scroll ? (
    <ScrollView {...scrollViewProps} keyboardShouldPersistTaps={scrollViewProps?.keyboardShouldPersistTaps ?? 'handled'} contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>{children}</ScrollView>
  ) : <View style={[styles.content, contentContainerStyle]}>{children}</View>;
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <StatusBar barStyle={statusBarStyle} />
      {keyboardAvoiding ? <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>{content}</KeyboardAvoidingView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flex: 1, padding: spacing.md },
  scrollContent: { flexGrow: 1, padding: spacing.md },
});

export default AppScreen;
