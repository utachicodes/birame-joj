import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import { Colors, Spacing, Typography, Radius, Shadows } from '../theme';

type Mode = 'login' | 'register';
type Lang = 'FR' | 'EN' | 'AR' | 'WO';

const LANGUAGES: Lang[] = ['FR', 'EN', 'AR', 'WO'];

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [lang, setLang] = useState<Lang>('FR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <LinearGradient colors={['#050A18', '#0D0B2E', '#050A18']} style={styles.container}>
      <StatusBar style="light" />

      {/* Blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Language picker */}
          <View style={styles.langRow}>
            {LANGUAGES.map((l) => (
              <Pressable
                key={l}
                onPress={() => setLang(l)}
                style={[styles.langPill, l === lang && styles.langPillActive]}
              >
                <Text style={[styles.langText, l === lang && styles.langTextActive]}>
                  {l}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Logo / Brand */}
          <View style={styles.brand}>
            <View style={styles.logoRing}>
              <Text style={styles.logoEmoji}>🏆</Text>
            </View>
            <Text style={styles.appName}>JOJ SuperApp</Text>
            <Text style={styles.appTagline}>Jeux de la Francophonie · Dakar 2024</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.cardOverlay]} />

            {/* Toggle tabs */}
            <View style={styles.tabRow}>
              <Pressable
                style={[styles.tab, mode === 'login' && styles.tabActive]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                  Connexion
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, mode === 'register' && styles.tabActive]}
                onPress={() => setMode('register')}
              >
                <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                  Inscription
                </Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              {mode === 'register' && (
                <GlassInput
                  label="Nom complet"
                  icon="person-outline"
                  placeholder="Mamadou Diallo"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              )}
              <GlassInput
                label="Email ou téléphone"
                icon="mail-outline"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <GlassInput
                label="Mot de passe"
                icon="lock-closed-outline"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                rightIcon={showPass ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPass(!showPass)}
              />

              {mode === 'login' && (
                <Pressable style={styles.forgotRow}>
                  <Text style={styles.forgotText}>Mot de passe oublié?</Text>
                </Pressable>
              )}

              <GlassButton
                title={mode === 'login' ? 'Se connecter' : 'Créer un compte'}
                onPress={handleAuth}
                fullWidth
                size="lg"
                loading={loading}
                gradient={[Colors.orange, Colors.orangeLight]}
              />

              {/* Biometric */}
              {mode === 'login' && (
                <Pressable style={styles.biometricBtn}>
                  <Ionicons name="finger-print-outline" size={28} color={Colors.textSecondary} />
                  <Text style={styles.biometricText}>Face ID / Empreinte</Text>
                </Pressable>
              )}
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou continuer avec</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social logins */}
            <View style={styles.socialRow}>
              {[
                { icon: '🇬 Google', label: 'Google' },
                { icon: '📱', label: 'Apple' },
                { icon: '📘', label: 'Facebook' },
              ].map((s) => (
                <Pressable key={s.label} style={styles.socialBtn}>
                  <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
                  <Text style={styles.socialLabel}>{s.icon}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Text style={styles.legal}>
            En continuant, vous acceptez nos{' '}
            <Text style={styles.legalLink}>Conditions d'utilisation</Text>
            {' '}et notre{' '}
            <Text style={styles.legalLink}>Politique de confidentialité</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blob1: {
    width: 320,
    height: 320,
    backgroundColor: Colors.orange + '12',
    top: -60,
    right: -80,
  },
  blob2: {
    width: 260,
    height: 260,
    backgroundColor: Colors.purple + '15',
    bottom: 100,
    left: -60,
  },
  scroll: {
    paddingHorizontal: 24,
    gap: 24,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border1,
    backgroundColor: Colors.glass1,
  },
  langPillActive: {
    backgroundColor: Colors.orange + '25',
    borderColor: Colors.orange + '50',
  },
  langText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  langTextActive: {
    color: Colors.orange,
  },
  brand: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: Colors.glass2,
    borderWidth: 1.5,
    borderColor: Colors.orange + '40',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow(Colors.orange),
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    ...Typography.title1,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appTagline: {
    ...Typography.footnote,
    color: Colors.textTertiary,
  },
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border1,
    overflow: 'hidden',
    padding: 24,
    gap: 20,
    ...Shadows.lg,
  },
  cardOverlay: {
    backgroundColor: Colors.glass2,
    borderRadius: Radius.xl,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.glass1,
    borderRadius: Radius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabActive: {
    backgroundColor: Colors.glass3,
  },
  tabText: {
    ...Typography.callout,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.text,
  },
  form: {
    gap: 14,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -6,
  },
  forgotText: {
    ...Typography.footnote,
    color: Colors.orange,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  biometricText: {
    ...Typography.callout,
    color: Colors.textSecondary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border1,
  },
  dividerText: {
    ...Typography.footnote,
    color: Colors.textTertiary,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  socialBtn: {
    width: 64,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLabel: {
    fontSize: 18,
  },
  legal: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: Colors.orange,
  },
});
