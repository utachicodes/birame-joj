import React, { useState, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router'; // file-based routing
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // required wrapper for gestures
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'; // controls the native splash screen
import { AppProvider, useApp } from '../src/context/AppContext';
import AppSplash from '../src/components/AppSplash';

SplashScreen.preventAutoHideAsync(); // keep splash visible until we're ready

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null; info: string }
> {
  state = { error: null as Error | null, info: '' };

  static getDerivedStateFromError(error: Error) {
    return { error, info: '' }; // switch to error state on throw
  }

  componentDidCatch(error: Error, info: any) {
    this.setState({ error, info: info?.componentStack || '' }); // capture stack trace
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
    return this.props.children; // normal render when no error
  }
}

const errStyles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#050A18' },
  scroll: { padding: 24, paddingTop: 80 },
  title: { color: '#FF6B35', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  msg: { color: '#fff', fontSize: 15, marginBottom: 16, lineHeight: 22 },
  stack: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace' }, // mono for readability
});

// Watches auth state and redirects accordingly — must be inside AppProvider
function AuthGuard() {
  const { state } = useApp();
  const router    = useRouter();
  const segments  = useSegments(); // current route segments

  useEffect(() => {
    if (!state.sessionRestored) return; // wait until session is loaded from storage
    const inPublic = segments[0] === 'auth' || segments[0] === 'onboarding' || segments[0] === 'greeting';
    if (!state.isLoggedIn && !inPublic) {
      router.replace('/auth' as any); // not logged in, kick to auth
    } else if (state.isLoggedIn && (segments[0] === 'auth' || segments[0] === 'onboarding')) {
      router.replace('/(tabs)' as any); // already logged in, skip auth
    }
  }, [state.isLoggedIn, state.sessionRestored]);

  return null; // no UI, just side effects
}

function InnerLayout() {
  const { state } = useApp();
  const [animDone, setAnimDone] = useState(false);
  const showSplash = !animDone || !state.sessionRestored; // hide only when both are ready

  // If anim finished before session restored, hide native splash once session arrives
  useEffect(() => {
    if (animDone && state.sessionRestored) {
      SplashScreen.hideAsync(); // safe to drop the native splash now
    }
  }, [animDone, state.sessionRestored]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AuthGuard />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="greeting" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="wallet" options={{ presentation: 'modal' }} /> {/* modal slide-up */}
          <Stack.Screen name="map" />
          <Stack.Screen name="food" />
        </Stack>
        {showSplash && (
          <AppSplash
            onAnimDone={() => setAnimDone(true)} // called when logo animation finishes
          />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProvider> {/* global state lives here */}
        <InnerLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }, // GestureHandlerRootView must fill the screen
});
