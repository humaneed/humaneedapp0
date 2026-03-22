import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { loadStore } from './src/store/useStore';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Colors, Typography } from './src/constants/theme';

const DARK_THEME = {
  dark: true,
  colors: {
    primary: Colors.teal,
    background: Colors.bg,
    card: Colors.bgCard,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.coral,
  },
};

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadStore().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
        <Text style={styles.splashLogo}>HUMANEED</Text>
        <Text style={styles.splashTagline}>Biologische Abstimmung</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={DARK_THEME}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.teal,
    letterSpacing: 6,
    marginBottom: 8,
  },
  splashTagline: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
