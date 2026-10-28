import React from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle, type StyleProp } from 'react-native';
import { colors, typography } from '../../theme';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  fontWeight?: TextStyle['fontWeight'];
  style?: StyleProp<TextStyle>;
}

const variantStyles = {
  title: typography.title,
  subtitle: typography.subtitle,
  body: typography.body,
  caption: typography.caption,
} satisfies Record<TextVariant, TextStyle>;

function AppText({ variant = 'body', color = colors.text, align, fontWeight, style, ...textProps }: AppTextProps) {
  return <Text {...textProps} style={[styles.base, variantStyles[variant], { color, textAlign: align, fontWeight }, style]} />;
}

const styles = StyleSheet.create({ base: { includeFontPadding: false } });

export default AppText;
