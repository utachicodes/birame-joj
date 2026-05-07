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
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import GlassInput from '../components/GlassInput';
import { Colors, Typography, Radius } from '../theme';

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
      router.replace('/(tabs)' as any);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bgDeep]} style={StyleSheet.absoluteFill} />
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.langRow}>
            {LANGUAGES.map((l) => (
              <Pressable key={l} onPress={() => setLang(l)} style={[styles.langPill, l === lang && styles.langPillActive]}>
                <Text style={[styles.langText, l === lang && styles.langTextActive]}>{l}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.brand}>
            <View style={styles.brandRingOuter}>
              <View style={styles.brandRingInner}>
                <Ionicons name="trophy" size={36} color={Colors.brand} />
              </View>
            </View>
            <Text style={styles.appName}>JOJ Dakar 2026</Text>
            <Text style={styles.appTagline}>Jeux de la Francophonie</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tabRow}>
              <Pressable style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => setMode('login')}>
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Connexion</Text>
              </Pressable>
              <Pressable style={[styles.tab, mode === 'register' && styles.tabActive]} onPress={() => setMode('register')}>
                <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Inscription</Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              {mode === 'register' && (
                <GlassInput label="Nom complet" icon="person-outline" placeholder="Mamadou Diallo" value={name} onChangeText={setName} autoCapitalize="words" />
              )}
              <GlassInput label="Email ou téléphone" icon="mail-outline" placeholder="vous@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
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
                  <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                </Pressable>
              )}

              <Pressable style={styles.cta} onPress={handleAuth} disabled={loading}>
                <LinearGradient colors={[Colors.brand, Colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                <Text style={styles.ctaText}>{mode === 'login' ? 'Se connecter' : 'Créer un compte'}</Text>
              </Pressable>

              {mode === 'login' && (
                <Pressable style={styles.bioBtn}>
                  <Ionicons name="finger-print-outline" size={22} color={Colors.brand} />
                  <Text style={styles.bioText}>Face ID / Empreinte digitale</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU CONTINUER AVEC</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <SocialBtn icon="logo-google" label="Google" />
              <SocialBtn icon="logo-apple" label="Apple" />
              <SocialBtn icon="logo-facebook" label="Facebook" />
            </View>
          </View>

          <Text style={styles.legal}>
            En continuant, vous acceptez les{' '}
            <Text style={styles.legalLink}>Conditions d'utilisation</Text>
            {' '}et la{' '}
            <Text style={styles.legalLink}>Politique de confidentialité</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function SocialBtn({ icon, label }: { icon: any; label: string }) {
  return (
    <Pressable style={styles.socialBtn}>
      <Ionicons name={icon} size={22} color={Colors.text} />
      <Text style={styles.socialLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  glow1: { position: 'absolute', width: 360, height: 360, borderRadius: 180, backgroundColor: Colors.brand + '10', top: -80, right: -80 },
  glow2: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: Colors.purple + '12', bottom: 120, left: -60 },
  scroll: { paddingHorizontal: 24, gap: 24 },

  langRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 6 },
  langPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border1, backgroundColor: Colors.surface1 },
  langPillActive: { backgroundColor: Colors.brand + '15', borderColor: Colors.brand + '50' },
  langText: { fontSize: 11, fontWeight: '700', color: Colors.textTertiary, letterSpacing: 0.5 },
  langTextActive: { color: Colors.brand },

  brand: { alignItems: 'center', gap: 10 },
  brandRingOuter: { width: 96, height: 96, borderRadius: 28, backgroundColor: Colors.brand + '08', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.brand + '20' },
  brandRingInner: { width: 70, height: 70, borderRadius: 22, backgroundColor: Colors.brand + '15', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.brand + '30' },
  appName: { fontSize: 22, fontWeight: '900', color: Colors.text, letterSpacing: -0.4, marginTop: 6 },
  appTagline: { ...Typography.footnote, color: Colors.textTertiary },

  card: { borderRadius: Radius.xl, padding: 22, gap: 20, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1 },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface1, borderRadius: Radius.md, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.sm },
  tabActive: { backgroundColor: Colors.surface3 },
  tabText: { ...Typography.callout, color: Colors.textTertiary, fontWeight: '600' },
  tabTextActive: { color: Colors.text },

  form: { gap: 14 },
  forgotRow: { alignItems: 'flex-end' },
  forgotText: { ...Typography.footnote, color: Colors.brand, fontWeight: '600' },

  cta: { height: 56, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 4 },
  ctaText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },

  bioBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: Radius.md, backgroundColor: Colors.brand + '12', borderWidth: 1, borderColor: Colors.brand + '25' },
  bioText: { ...Typography.callout, color: Colors.brand, fontWeight: '700' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.border2 },
  dividerText: { fontSize: 10, fontWeight: '700', color: Colors.textTertiary, letterSpacing: 1 },

  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtn: { flex: 1, height: 48, borderRadius: Radius.md, backgroundColor: Colors.surface1, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center', gap: 4, flexDirection: 'row' },
  socialLabel: { ...Typography.caption, fontWeight: '600' },

  legal: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center', lineHeight: 17 },
  legalLink: { color: Colors.brand },
});
