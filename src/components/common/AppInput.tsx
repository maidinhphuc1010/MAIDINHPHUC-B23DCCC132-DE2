import React from 'react';
import { StyleSheet, TextInput, View, type KeyboardTypeOptions, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';
import AppText from './AppText';

export interface AppInputProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'style'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
}

function AppInput({ label, placeholder, value, onChangeText, error, keyboardType = 'default', secureTextEntry, multiline, style, ...inputProps }: AppInputProps) {
  return (
    <View style={[styles.container, style]}>
      {label ? <AppText variant="body" style={styles.label}>{label}</AppText> : null}
      <TextInput
        {...inputProps}
        accessibilityLabel={label}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.multiline, error ? styles.inputError : null]}
      />
      {error ? <AppText accessibilityRole="alert" variant="caption" color={colors.error} style={styles.error}>{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { marginBottom: spacing.xs },
  input: { minHeight: 48, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, backgroundColor: colors.surface, color: colors.text, ...typography.body },
  multiline: { minHeight: 96, paddingTop: spacing.sm },
  inputError: { borderColor: colors.error },
  error: { marginTop: spacing.xxs },
});

export default AppInput;
