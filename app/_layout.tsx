import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { AppProvider } from '../src/context/AppContext';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null; info: string }
> {
  state = { error: null as Error | null, info: '' };

  static getDerivedStateFromError(error: Error) {
    return { error, info: '' };
  }

  componentDidCatch(error: Error, info: any) {
    this.setState({ error, info: info?.componentStack || '' });
  }

  render() {
    if (this.state.error) {
      return (
        <View style={errStyles.wrap}>
          <ScrollView contentContainerStyle={errStyles.scroll}>
            <Text style={errStyles.title}>Crash caught</Text>
            <Text style={errStyles.msg}>{String(this.state.error.message)}</Text>
            <Text style={errStyles.stack}>{String(this.state.error.stack)}</Text>
            {!!this.state.info && (
              <Text style={errStyles.stack}>{this.state.info}</Text>
            )}
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const errStyles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#050A18' },
  scroll: { padding: 24, paddingTop: 80 },
  title: { color: '#FF6B35', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  msg: { color: '#fff', fontSize: 15, marginBottom: 16, lineHeight: 22 },
  stack: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace' },
});

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <GestureHandlerRootView style={styles.root}>
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="wallet" options={{ presentation: 'modal' }} />
              <Stack.Screen name="map" />
              <Stack.Screen name="food" />
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </AppProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
