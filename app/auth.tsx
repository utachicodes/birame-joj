import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';

const { width: W } = Dimensions.get('window');

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, login, register } = useApp();

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [pagerH, setPagerH] = useState(520);

 
  const [siEmail, setSiEmail] = useState('');
  const [siPass, setSiPass] = useState('');
  const [siPassVis, setSiPassVis] = useState(false);

 
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPass, setSuPass] = useState('');
  const [suPassVis, setSuPassVis] = useState(false);

  const pagerRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goTo = (p: 0 | 1) => {
    pagerRef.current?.scrollTo({ x: p * W, animated: true });
  };

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

 
  React.useEffect(() => {
    if (state.isLoggedIn) router.replace('/(tabs)' as any);
  }, [state.isLoggedIn]);

  const handleSignIn = async () => {
    setAuthError('');
    if (!siEmail.trim() || !siPass.trim()) { setAuthError('Veuillez remplir tous les champs.'); return; }
    if (!validateEmail(siEmail)) { setAuthError('Email invalide.'); return; }
    setLoading(true);
    await login(siEmail, siPass);
    setLoading(false);
    if (state.authError) setAuthError(state.authError);
  };

  const handleSignUp = async () => {
    setAuthError('');
    if (!suName.trim() || !suEmail.trim() || !suPass.trim()) { setAuthError('Veuillez remplir tous les champs.'); return; }
    if (!validateEmail(suEmail)) { setAuthError('Email invalide.'); return; }
    if (suPass.length < 8) { setAuthError('Mot de passe trop court (8 caractères min).'); return; }
    setLoading(true);
    await register({ name: suName, email: suEmail, password: suPass, country: 'Sénégal', countryCode: 'SN', role: 'Visiteur' });
    setLoading(false);
    if (state.authError) setAuthError(state.authError);
  };

  const handleBiometric = () => {
    setAuthError('Biométrie non disponible en mode démo.');
  };

 
  const dot0W = scrollX.interpolate({ inputRange: [0, W], outputRange: [24, 8], extrapolate: 'clamp' });
  const dot0O = scrollX.interpolate({ inputRange: [0, W], outputRange: [1, 0.35], extrapolate: 'clamp' });
  const dot1W = scrollX.interpolate({ inputRange: [0, W], outputRange: [8, 24], extrapolate: 'clamp' });
  const dot1O = scrollX.interpolate({ inputRange: [0, W], outputRange: [0.35, 1], extrapolate: 'clamp' });

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      {/* Deep background */}
      <LinearGradient
        colors={['#070A14', '#0B1022', '#070A14']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient glows */}
      <View style={s.orbA} /> {/* orange glow top-right */}
      <View style={s.orbB} /> {/* purple glow bottom-left */}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* ── Header ── */}
        <View style={[s.header, { paddingTop: insets.top + 20 }]}>
          <View style={s.logoBg}>
            <Image
              source={require('../assets/dakarlogo.png')}
              style={s.headerLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={s.appName}>Birame</Text>
          <Text style={s.appSub}>JOJ Dakar 2026</Text>
        </View>

        {/* ── Pager ── */}
        <View
          style={{ flex: 1 }}
          onLayout={(e) => setPagerH(e.nativeEvent.layout.height)}
        >
          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false } // can't use native driver for layout props
            )}
          >
            {/* Page 0 – Sign In */}
            <View style={{ width: W, height: pagerH }}>
              <ScrollView
                contentContainerStyle={[s.pageContent, { minHeight: pagerH }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled" // tap outside doesn't dismiss keyboard
              >
                <View style={s.pageHead}>
                  <Text style={s.pageTitle}>Welcome back</Text>
                  <Text style={s.pageSub}>Sign in to your account</Text>
                </View>

                {!!authError && (
                  <View style={s.errorBox}>
                    <Ionicons name="alert-circle-outline" size={15} color="#E63946" />
                    <Text style={s.errorText}>{authError}</Text>
                  </View>
                )}
                <View style={s.fields}>
                  <Field
                    placeholder="Email address"
                    icon="mail-outline"
                    value={siEmail}
                    onChangeText={setSiEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Field
                    placeholder="Password"
                    icon="lock-closed-outline"
                    value={siPass}
                    onChangeText={setSiPass}
                    secureTextEntry={!siPassVis}
                    rightIcon={siPassVis ? 'eye-off-outline' : 'eye-outline'}
                    onRightPress={() => setSiPassVis((v) => !v)}
                  />
                  <Pressable
                    onPress={() =>
                      Alert.alert('Password reset', 'A reset link will be sent to your email.')
                    }
                    style={s.forgotRow}
                    hitSlop={8}
                  >
                    <Text style={s.forgotText}>Forgot password?</Text>
                  </Pressable>
                </View>

                <PrimaryBtn label="Sign In" onPress={handleSignIn} loading={loading} />

                <View style={s.sep}>
                  <View style={s.sepLine} />
                  <Text style={s.sepLabel}>or continue with</Text>
                  <View style={s.sepLine} />
                </View>

                <BiometricBtn onPress={handleBiometric} />

                <Pressable onPress={() => goTo(1)} style={s.switchRow}>
                  <Text style={s.switchBase}>New here?{'  '}</Text>
                  <Text style={s.switchAccent}>Create account</Text>
                </Pressable>
              </ScrollView>
            </View>

            {/* Page 1 – Sign Up */}
            <View style={{ width: W, height: pagerH }}>
              <ScrollView
                contentContainerStyle={[s.pageContent, { minHeight: pagerH }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={s.pageHead}>
                  <Text style={s.pageTitle}>Create account</Text>
                  <Text style={s.pageSub}>Join the Francophone Games</Text>
                </View>

                {!!authError && (
                  <View style={s.errorBox}>
                    <Ionicons name="alert-circle-outline" size={15} color="#E63946" />
                    <Text style={s.errorText}>{authError}</Text>
                  </View>
                )}
                <View style={s.fields}>
                  <Field
                    placeholder="Full name"
                    icon="person-outline"
                    value={suName}
                    onChangeText={setSuName}
                    autoCapitalize="words"
                  />
                  <Field
                    placeholder="Email address"
                    icon="mail-outline"
                    value={suEmail}
                    onChangeText={setSuEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Field
                    placeholder="Password (8+ characters)"
                    icon="lock-closed-outline"
                    value={suPass}
                    onChangeText={setSuPass}
                    secureTextEntry={!suPassVis}
                    rightIcon={suPassVis ? 'eye-off-outline' : 'eye-outline'}
                    onRightPress={() => setSuPassVis((v) => !v)}
                  />
                </View>

                <PrimaryBtn label="Create Account" onPress={handleSignUp} loading={loading} />

                <Pressable onPress={() => goTo(0)} style={[s.switchRow, { marginTop: 28 }]}>
                  <Text style={s.switchBase}>Already have an account?{'  '}</Text>
                  <Text style={s.switchAccent}>Sign in</Text>
                </Pressable>
              </ScrollView>
            </View>
          </ScrollView>
        </View>

        {/* ── Dot indicator ── */}
        <View style={[s.dots, { paddingBottom: insets.bottom + 20 }]}>
          <Animated.View style={[s.dot, { width: dot0W, opacity: dot0O }]} />
          <Animated.View style={[s.dot, { width: dot1W, opacity: dot1O }]} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────

function Field({
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry,
  rightIcon,
  onRightPress,
  keyboardType,
  autoCapitalize,
}: {
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  keyboardType?: any;
  autoCapitalize?: any;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[fS.wrap, focused && fS.wrapFocused]}>
      <Ionicons
        name={icon}
        size={17}
        color={focused ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.24)'}
      />
      <TextInput
        style={fS.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.20)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'none'}
        autoCorrect={false}
        selectionColor="#FF6B35"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {rightIcon && (
        <Pressable onPress={onRightPress} hitSlop={10}>
          <Ionicons name={rightIcon} size={17} color="rgba(255,255,255,0.28)" />
        </Pressable>
      )}
    </View>
  );
}

const fS = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: 16,
    gap: 10,
  },
  wrapFocused: {
    borderColor: 'rgba(255,107,53,0.40)',
    backgroundColor: 'rgba(255,255,255,0.075)',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    letterSpacing: -0.15,
  },
});

// ─── Primary button ───────────────────────────────────────────────────────────

function PrimaryBtn({
  label,
  onPress,
  loading,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 75, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={[pS.wrap, { transform: [{ scale }] }]}>
      <Pressable onPress={handlePress} disabled={loading} style={pS.btn}>
        <LinearGradient
          colors={['#FF8450', '#E6461C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={pS.label}>{label}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const pS = StyleSheet.create({
  wrap: { borderRadius: 16, overflow: 'hidden' },
  btn: { height: 56, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
});

// ─── Biometric button ─────────────────────────────────────────────────────────

function BiometricBtn({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={bS.btn}>
      <Ionicons name="finger-print-outline" size={19} color="rgba(255,255,255,0.52)" />
      <Text style={bS.label}>Use Face ID / Fingerprint</Text>
    </Pressable>
  );
}

const bS = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.50)',
    letterSpacing: -0.1,
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070A14',
  },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(230,57,70,0.12)', borderWidth: 1,
    borderColor: 'rgba(230,57,70,0.30)', borderRadius: 10, padding: 10,
  },
  errorText: { flex: 1, fontSize: 13, color: '#E63946', fontWeight: '500' },
  orbA: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    top: -120,
    right: -100,
    backgroundColor: 'rgba(255,107,53,0.065)',
  },
  orbB: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: 60,
    left: -100,
    backgroundColor: 'rgba(123,94,167,0.085)',
  },
  header: {
    alignItems: 'center',
    gap: 7,
    paddingBottom: 24,
  },
  logoBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(255,107,53,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  logoBg: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 4,
  },
  headerLogo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 27,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  appSub: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.32)',
    letterSpacing: 0.5,
  },
  pageContent: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 20,
    justifyContent: 'center',
  },
  pageHead: {
    gap: 6,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.7,
  },
  pageSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: -0.1,
  },
  fields: {
    gap: 12,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B35',
  },
  sep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sepLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  sepLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.28)',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchBase: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.36)',
  },
  switchAccent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B35',
  },
});
