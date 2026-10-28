/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppButton, AppScreen, AppText, Loading } from './src/components/common';
import { BookingProvider } from './src/context/BookingContext';
import { FieldProvider } from './src/context/FieldContext';
import { useFields } from './src/hooks/useFields';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme';

function App() {
  return (
    <SafeAreaProvider>
      <FieldProvider>
        <BookingProvider>
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <AppBootstrap />
          </View>
        </BookingProvider>
      </FieldProvider>
    </SafeAreaProvider>
  );
}

function AppBootstrap() {
  const { loading, error, retryInitialization } = useFields();
  if (loading) return <Loading fullScreen message="Đang khởi tạo dữ liệu…" />;
  if (error) {
    return (
      <AppScreen>
        <AppText variant="title">Không thể khởi tạo ứng dụng</AppText>
        <AppText accessibilityRole="alert" color={colors.error}>{error}</AppText>
        <AppButton title="Thử lại" onPress={() => { void retryInitialization(); }} />
      </AppScreen>
    );
  }
  return <AppNavigator />;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background } });

export default App;
