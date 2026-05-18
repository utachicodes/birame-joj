import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, Pressable, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // notch-safe padding
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import GlassInput from '../components/GlassInput';
import { Colors, Typography, Radius } from '../theme';
import { useApp } from '../context/AppContext';

type Mode = 'login' | 'register'; // which form is showing
type Lang = 'FR' | 'EN' | 'AR' | 'WO'; // supported UI languages

const LANGUAGES: Lang[] = ['FR', 'EN', 'AR', 'WO']; // language picker options

const COUNTRIES = [ // list for the country dropdown
  { name: 'Sénégal', code: 'SN' },
  { name: 'France', code: 'FR' },
  { name: 'Maroc', code: 'MA' },
  { name: 'Côte d\'Ivoire', code: 'CI' },
  { name: 'Cameroun', code: 'CM' },
  { name: 'Algérie', code: 'DZ' },
  { name: 'Mali', code: 'ML' },
  { name: 'Guinée', code: 'GN' },
  { name: 'Autre', code: 'XX' }, // catch-all for other countries
];

const ROLES = ['Visiteur', 'Athlète', 'Journaliste', 'Staff', 'Volontaire']; // accreditation types

export default function AuthScreen() {
  const insets = useSafeAreaInsets(); // respect device safe area
  const router  = useRouter();
  const { state, login, register, dispatch } = useApp(); // pull auth actions from context

  const [mode, setMode]           = useState<Mode>('login'); // default to login tab
  const [lang, setLang]           = useState<Lang>('FR'); // default language
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false); // toggle password visibility
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [role, setRole]           = useState('Visiteur'); // default role
  const [country, setCountry]     = useState(COUNTRIES[0]); // default to Senegal
  const [showCountry, setShowCountry] = useState(false); // country dropdown open state
  const [showRole, setShowRole]   = useState(false); // role dropdown open state

  const handleAuth = async () => {
    dispatch({ type: 'CLEAR_AUTH_ERROR' }); // wipe previous error before trying
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register({ name, email, password, country: country.name, countryCode: country.code, role, phone });
    }
  };

  // Navigate once logged in
  React.useEffect(() => {
    if (state.isLoggedIn) {
      router.replace('/(tabs)' as any); // send user to main app
    }
  }, [state.isLoggedIn]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bgDeep]} style={StyleSheet.absoluteFill} /> {/* full-screen background */}
      <View style={styles.glow1} /> {/* decorative glow, top-right */}
      <View style={styles.glow2} /> {/* decorative glow, bottom-left */}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}> {/* push content above keyboard */}
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // taps on buttons still work while keyboard is up
        >
          <View style={styles.langRow}>
            {LANGUAGES.map((l) => (
              <Pressable key={l} onPress={() => setLang(l)} style={[styles.langPill, l === lang && styles.langPillActive]}>
                <Text style={[styles.langText, l === lang && styles.langTextActive]}>{l}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.brand}> {/* logo + app name block */}
            <View style={styles.brandRingOuter}> {/* outer ring around icon */}
              <View style={styles.brandRingInner}> {/* inner ring around icon */}
                <Ionicons name="trophy" size={36} color={Colors.brand} />
              </View>
            </View>
            <Text style={styles.appName}>JOJ Dakar 2026</Text>
            <Text style={styles.appTagline}>Jeux de la Francophonie</Text>
          </View>

          <View style={styles.card}> {/* main form container */}
            <View style={styles.tabRow}> {/* login / register toggle */}
              <Pressable style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => { setMode('login'); dispatch({ type: 'CLEAR_AUTH_ERROR' }); }}>
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Connexion</Text>
              </Pressable>
              <Pressable style={[styles.tab, mode === 'register' && styles.tabActive]} onPress={() => { setMode('register'); dispatch({ type: 'CLEAR_AUTH_ERROR' }); }}>
                <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Inscription</Text>
              </Pressable>
            </View>

            {!!state.authError && ( // show error only when one exists
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{state.authError}</Text>
              </View>
            )}

            <View style={styles.form}>
              {mode === 'register' && ( // extra fields only for sign-up
                <>
                  <GlassInput
                    label="Nom complet *"
                    icon="person-outline"
                    placeholder="Votre nom"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                  <GlassInput
                    label="Téléphone (optionnel)"
                    icon="call-outline"
                    placeholder="+221 77 000 0000"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />

                  {/* Country picker */}
                  <View>
                    <Text style={styles.fieldLabel}>Pays *</Text>
                    <Pressable style={styles.picker} onPress={() => setShowCountry(!showCountry)}> {/* toggle dropdown */}
                      <Ionicons name="earth-outline" size={18} color={Colors.textSecondary} />
                      <Text style={styles.pickerText}>{country.name}</Text>
                      <Ionicons name={showCountry ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textTertiary} /> {/* arrow flips when open */}
                    </Pressable>
                    {showCountry && (
                      <View style={styles.dropdown}>
                        {COUNTRIES.map((c) => (
                          <Pressable key={c.code} style={[styles.dropItem, c.code === country.code && styles.dropItemActive]} onPress={() => { setCountry(c); setShowCountry(false); }}> {/* select and close */}
                            <Text style={[styles.dropText, c.code === country.code && styles.dropTextActive]}>{c.name}</Text>
                            {c.code === country.code && <Ionicons name="checkmark" size={16} color={Colors.brand} />} {/* checkmark on selected */}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Role picker */}
                  <View>
                    <Text style={styles.fieldLabel}>Rôle / Accréditation *</Text>
                    <Pressable style={styles.picker} onPress={() => setShowRole(!showRole)}>
                      <Ionicons name="id-card-outline" size={18} color={Colors.textSecondary} />
                      <Text style={styles.pickerText}>{role}</Text>
                      <Ionicons name={showRole ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textTertiary} />
                    </Pressable>
                    {showRole && (
                      <View style={styles.dropdown}>
                        {ROLES.map((r) => (
                          <Pressable key={r} style={[styles.dropItem, r === role && styles.dropItemActive]} onPress={() => { setRole(r); setShowRole(false); }}>
                            <Text style={[styles.dropText, r === role && styles.dropTextActive]}>{r}</Text>
                            {r === role && <Ionicons name="checkmark" size={16} color={Colors.brand} />}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </>
              )}

              <GlassInput
                label="Email *"
                icon="mail-outline"
                placeholder="vous@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none" // emails are always lowercase
              />
              <GlassInput
                label="Mot de passe *"
                icon="lock-closed-outline"
                placeholder={mode === 'register' ? 'Minimum 8 caractères' : '••••••••'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass} // hide/show based on toggle
                rightIcon={showPass ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={() => setShowPass(!showPass)}
              />

              {mode === 'login' && ( // forgot password only makes sense on login
                <Pressable style={styles.forgotRow}>
                  <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                </Pressable>
              )}

              <Pressable style={[styles.cta, state.authLoading && { opacity: 0.7 }]} onPress={handleAuth} disabled={state.authLoading}> {/* dim while loading */}
                <LinearGradient colors={[Colors.brand, Colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                {state.authLoading
                  ? <ActivityIndicator color="#fff" /> // spinner during request
                  : <Text style={styles.ctaText}>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</Text>
                }
              </Pressable>

              {mode === 'login' && ( // biometrics only on login screen
                <Pressable style={styles.bioBtn}>
                  <Ionicons name="finger-print-outline" size={22} color={Colors.brand} />
                  <Text style={styles.bioText}>Face ID / Empreinte digitale</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.divider}> {/* "or continue with" separator */}
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU CONTINUER AVEC</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}> {/* social sign-in buttons */}
              <SocialBtn icon="logo-google" label="Google" />
              <SocialBtn icon="logo-apple" label="Apple" />
              <SocialBtn icon="logo-facebook" label="Facebook" />
            </View>
          </View>

          <Text style={styles.legal}> {/* terms & privacy notice */}
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
  glow1: { position: 'absolute', width: 360, height: 360, borderRadius: 180, backgroundColor: Colors.brand + '10', top: -80, right: -80 }, // brand glow, top-right
  glow2: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: Colors.purple + '12', bottom: 120, left: -60 }, // purple glow, bottom-left
  scroll: { paddingHorizontal: 24, gap: 24 },

  langRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }, // right-aligned pill row
  langPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border1, backgroundColor: Colors.surface1 },
  langPillActive: { backgroundColor: Colors.brand + '15', borderColor: Colors.brand + '50' }, // highlight active language
  langText: { fontSize: 11, fontWeight: '700', color: Colors.textTertiary, letterSpacing: 0.5 },
  langTextActive: { color: Colors.brand },

  brand: { alignItems: 'center', gap: 10 },
  brandRingOuter: { width: 96, height: 96, borderRadius: 28, backgroundColor: Colors.brand + '08', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.brand + '20' },
  brandRingInner: { width: 70, height: 70, borderRadius: 22, backgroundColor: Colors.brand + '15', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.brand + '30' },
  appName: { fontSize: 22, fontWeight: '900', color: Colors.text, letterSpacing: -0.4, marginTop: 6 },
  appTagline: { ...Typography.footnote, color: Colors.textTertiary },

  card: { borderRadius: Radius.xl, padding: 22, gap: 20, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1 }, // glass-like form card
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface1, borderRadius: Radius.md, padding: 4 }, // segmented control wrapper
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.sm },
  tabActive: { backgroundColor: Colors.surface3 }, // selected tab bg
  tabText: { ...Typography.callout, color: Colors.textTertiary, fontWeight: '600' },
  tabTextActive: { color: Colors.text },

  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.error + '15', borderWidth: 1, borderColor: Colors.error + '30', borderRadius: Radius.md, padding: 12 },
  errorText: { flex: 1, fontSize: 13, color: Colors.error, fontWeight: '500' },

  form: { gap: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  picker: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface1, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.md, padding: 14 }, // custom select trigger
  pickerText: { flex: 1, color: Colors.text, fontSize: 15 },
  dropdown: { backgroundColor: Colors.surface3, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.md, marginTop: 4, overflow: 'hidden' }, // dropdown list container
  dropItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, paddingHorizontal: 14 },
  dropItemActive: { backgroundColor: Colors.brand + '15' }, // highlight selected item
  dropText: { fontSize: 14, color: Colors.textSecondary },
  dropTextActive: { color: Colors.text, fontWeight: '600' },

  forgotRow: { alignItems: 'flex-end' },
  forgotText: { ...Typography.footnote, color: Colors.brand, fontWeight: '600' },

  cta: { height: 56, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 4 }, // main submit button
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
  legalLink: { color: Colors.brand }, // tappable link style
});
