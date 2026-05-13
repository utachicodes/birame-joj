import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  Alert,
  Animated,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { useTranslation } from '../src/i18n';
import { getColors, Radius } from '../src/theme';

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const t = useTranslation(state.language);
  const C = getColors(state.theme);
  const isRTL = state.language === 'ar';

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchMode = (newMode: Mode) => {
    Animated.spring(slideAnim, {
      toValue: newMode === 'login' ? 0 : 1,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
    setMode(newMode);
  };

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t.error, 'Veuillez remplir tous les champs.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert(t.error, "Format d'email invalide.");
      return;
    }
    if (password.length < 6) {
      Alert.alert(t.error, 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'LOGIN', payload: { email } });
      setLoading(false);
      router.replace('/(tabs)' as any);
    }, 1000);
  };

  const handleRegister = () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert(t.error, 'Veuillez remplir tous les champs.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert(t.error, "Format d'email invalide.");
      return;
    }
    if (password.length < 8) {
      Alert.alert(t.error, 'Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t.error, 'Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'LOGIN', payload: { name: fullName, email } });
      setLoading(false);
      router.replace('/(tabs)' as any);
    }, 1000);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Réinitialisation',
      'Un email de réinitialisation a été envoyé à votre adresse.',
      [{ text: 'OK' }]
    );
  };

  const handleSocial = (provider: string) => {
    Alert.alert(provider, t.comingSoon);
  };

  const handleBiometric = () => {
    Alert.alert(t.biometricLogin, 'Authentification biométrique en cours...', [], { cancelable: false });
    setTimeout(() => {
      Alert.alert(t.success, 'Authentification réussie !');
      dispatch({ type: 'LOGIN' });
      router.replace('/(tabs)' as any);
    }, 1500);
  };

  const LANGUAGES: Array<{ code: 'fr' | 'en' | 'ar'; label: string }> = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  const s = makeStyles(C);

  return (
    <View style={[s.container, { backgroundColor: C.bg }]}>
      <StatusBar style={state.theme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient
        colors={[C.bg, C.bgElevated, C.bgDeep]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[s.glow1, { backgroundColor: C.brand + '10' }]} />
      <View style={[s.glow2, { backgroundColor: C.purple + '12' }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[s.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Language selector */}
          <View style={[s.langRow, isRTL && s.rtlRow]}>
            {LANGUAGES.map((l) => (
              <Pressable
                key={l.code}
                onPress={() => dispatch({ type: 'SET_LANGUAGE', payload: l.code })}
                style={[
                  s.langPill,
                  { borderColor: C.border1, backgroundColor: C.surface1 },
                  state.language === l.code && { backgroundColor: C.brand + '20', borderColor: C.brand + '60' },
                ]}
              >
                <Text style={[s.langText, { color: C.textTertiary }, state.language === l.code && { color: C.brand }]}>
                  {l.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Brand */}
          <View style={s.brand}>
            <View style={[s.brandRingOuter, { backgroundColor: C.brand + '08', borderColor: C.brand + '20' }]}>
              <View style={[s.brandRingInner, { backgroundColor: C.brand + '15', borderColor: C.brand + '30' }]}>
                <Ionicons name="trophy" size={36} color={C.brand} />
              </View>
            </View>
            <Text style={[s.appName, { color: C.text }]}>Birame</Text>
            <Text style={[s.appTagline, { color: C.textTertiary }]}>JOJ Dakar 2026</Text>
          </View>

          {/* Card */}
          <View style={[s.card, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
            {/* Tab switcher */}
            <View style={[s.tabRow, { backgroundColor: C.surface1 }]}>
              <Pressable
                style={[s.tab, mode === 'login' && { backgroundColor: C.surface3 }]}
                onPress={() => switchMode('login')}
              >
                <Text style={[s.tabText, { color: mode === 'login' ? C.text : C.textTertiary }]}>
                  {t.login}
                </Text>
              </Pressable>
              <Pressable
                style={[s.tab, mode === 'register' && { backgroundColor: C.surface3 }]}
                onPress={() => switchMode('register')}
              >
                <Text style={[s.tabText, { color: mode === 'register' ? C.text : C.textTertiary }]}>
                  {t.register}
                </Text>
              </Pressable>
            </View>

            {/* Form */}
            <View style={s.form}>
              {mode === 'register' && (
                <>
                  <InputField
                    label={t.fullName}
                    icon="person-outline"
                    placeholder="Mamadou Diallo"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    C={C}
                    isRTL={isRTL}
                  />
                  <InputField
                    label={t.phone}
                    icon="call-outline"
                    placeholder="+221 77 000 0000"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    C={C}
                    isRTL={isRTL}
                  />
                </>
              )}
              <InputField
                label={t.email}
                icon="mail-outline"
                placeholder="vous@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                C={C}
                isRTL={isRTL}
              />
              <InputField
                label={t.password}
                icon="lock-closed-outline"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                rightIcon={showPass ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPass(!showPass)}
                C={C}
                isRTL={isRTL}
              />
              {mode === 'register' && (
                <InputField
                  label={t.confirmPassword}
                  icon="lock-closed-outline"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPass}
                  rightIcon={showConfirmPass ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowConfirmPass(!showConfirmPass)}
                  C={C}
                  isRTL={isRTL}
                />
              )}

              {mode === 'login' && (
                <Pressable style={[s.forgotRow, isRTL && s.rtlRow]} onPress={handleForgotPassword}>
                  <Text style={[s.forgotText, { color: C.brand }]}>{t.forgotPassword}</Text>
                </Pressable>
              )}

              <Pressable
                style={s.cta}
                onPress={mode === 'login' ? handleLogin : handleRegister}
                disabled={loading}
              >
                <LinearGradient
                  colors={[C.brand, C.brandDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={s.ctaText}>
                    {mode === 'login' ? t.loginBtn : t.registerBtn}
                  </Text>
                )}
              </Pressable>

              {mode === 'login' && (
                <Pressable style={[s.bioBtn, { backgroundColor: C.brand + '12', borderColor: C.brand + '25' }]} onPress={handleBiometric}>
                  <Ionicons name="finger-print-outline" size={22} color={C.brand} />
                  <Text style={[s.bioText, { color: C.brand }]}>{t.biometricLogin}</Text>
                </Pressable>
              )}
            </View>

            {/* Divider */}
            <View style={s.divider}>
              <View style={[s.dividerLine, { backgroundColor: C.border2 }]} />
              <Text style={[s.dividerText, { color: C.textTertiary }]}>{t.orContinueWith.toUpperCase()}</Text>
              <View style={[s.dividerLine, { backgroundColor: C.border2 }]} />
            </View>

            {/* Social */}
            <View style={s.socialRow}>
              <SocialBtn icon="logo-google" label="Google" onPress={() => handleSocial('Google')} C={C} />
              <SocialBtn icon="logo-apple" label="Apple" onPress={() => handleSocial('Apple')} C={C} />
              <SocialBtn icon="logo-facebook" label="Facebook" onPress={() => handleSocial('Facebook')} C={C} />
            </View>
          </View>

          <Text style={[s.legal, { color: C.textTertiary }]}>
            {mode === 'login' ? t.noAccount : t.hasAccount}{'  '}
            <Text style={{ color: C.brand }} onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? t.registerBtn : t.loginBtn}
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function InputField({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  rightIcon,
  onRightIconPress,
  keyboardType,
  autoCapitalize,
  C,
  isRTL,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  keyboardType?: any;
  autoCapitalize?: any;
  C: ReturnType<typeof getColors>;
  isRTL: boolean;
}) {
  return (
    <View>
      <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Text>
      <View style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        backgroundColor: C.surface2,
        borderWidth: 1,
        borderColor: C.border2,
        borderRadius: Radius.md,
        paddingHorizontal: 14,
        height: 52,
        gap: 10,
      }}>
        <Ionicons name={icon} size={18} color={C.textTertiary} />
        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            color: C.text,
            textAlign: isRTL ? 'right' : 'left',
          }}
          placeholder={placeholder}
          placeholderTextColor={C.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} hitSlop={8}>
            <Ionicons name={rightIcon} size={18} color={C.textTertiary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function SocialBtn({
  icon,
  label,
  onPress,
  C,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  C: ReturnType<typeof getColors>;
}) {
  return (
    <Pressable
      style={{
        flex: 1,
        height: 48,
        borderRadius: Radius.md,
        backgroundColor: C.surface1,
        borderWidth: 1,
        borderColor: C.border1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flexDirection: 'row',
      }}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={C.text} />
      <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    glow1: { position: 'absolute', width: 360, height: 360, borderRadius: 180, top: -80, right: -80 },
    glow2: { position: 'absolute', width: 280, height: 280, borderRadius: 140, bottom: 120, left: -60 },
    scroll: { paddingHorizontal: 24, gap: 24 },
    langRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 6 },
    rtlRow: { flexDirection: 'row-reverse' },
    langPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1 },
    langText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    brand: { alignItems: 'center', gap: 10 },
    brandRingOuter: { width: 96, height: 96, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    brandRingInner: { width: 70, height: 70, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    appName: { fontSize: 28, fontWeight: '900', letterSpacing: -0.6, marginTop: 6 },
    appTagline: { fontSize: 13, fontWeight: '500' },
    card: { borderRadius: Radius.xl, padding: 22, gap: 20, borderWidth: 1 },
    tabRow: { flexDirection: 'row', borderRadius: Radius.md, padding: 4 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.sm },
    tabText: { fontSize: 14, fontWeight: '700' },
    form: { gap: 14 },
    forgotRow: { alignItems: 'flex-end' },
    forgotText: { fontSize: 13, fontWeight: '600' },
    cta: { height: 56, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 4 },
    ctaText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
    bioBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: Radius.md, borderWidth: 1 },
    bioText: { fontSize: 14, fontWeight: '700' },
    divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
    dividerText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
    socialRow: { flexDirection: 'row', gap: 10 },
    legal: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  });
}
