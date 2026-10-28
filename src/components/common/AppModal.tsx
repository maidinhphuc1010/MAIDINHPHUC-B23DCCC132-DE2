import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View, type ModalProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../../theme';
import AppText from './AppText';

export interface AppModalProps extends Pick<ModalProps, 'animationType' | 'transparent'> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function AppModal({ visible, onClose, title, children, style, animationType = 'fade', transparent = true }: AppModalProps) {
  return (
    <Modal visible={visible} transparent={transparent} animationType={animationType} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Đóng hộp thoại" style={StyleSheet.absoluteFill} onPress={onClose} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboard}>
          <View style={[styles.panel, style]}>
            {title ? <AppText variant="subtitle" style={styles.title}>{title}</AppText> : null}
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.overlay },
  keyboard: { maxHeight: '100%', justifyContent: 'center' },
  panel: { maxHeight: '100%', padding: spacing.lg, borderRadius: borderRadius.lg, backgroundColor: colors.surface, ...shadows.md },
  title: { marginBottom: spacing.md },
});

export default AppModal;
