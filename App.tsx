/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BookingProvider } from './src/context/BookingContext';
import { FieldProvider } from './src/context/FieldContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme';

function App() {
  return (
    <SafeAreaProvider>
      <FieldProvider>
        <BookingProvider>
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
          </View>
        </BookingProvider>
      </FieldProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background } });

export default App;
