import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { useTranslation } from '../../src/i18n';
import { getColors, Radius } from '../../src/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const t = useTranslation(state.language);
  const C = getColors(state.theme);

  const [showEditModal, setShowEditModal]         = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [editName, setEditName]                   = useState(state.user?.name ?? '');
  const [editPhone, setEditPhone]                 = useState(state.user?.phone ?? '');
  const [oldPassword, setOldPassword]             = useState('');
  const [newPassword, setNewPassword]             = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // fall back to a guest object when no one is logged in
  const user = state.user ?? {
    name: 'Visiteur',
    email: 'visiteur@joj2026.sn',
    role: 'Visiteur',
    country: 'Sénégal',
    countryCode: 'SN',
    accreditation: 'JOJ-2026-VIS-00000',
    phone: '',
    avatar: 'VT', // two-letter initials
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert(t.error, 'Le nom ne peut pas être vide.');
      return;
    }
    dispatch({ type: 'UPDATE_USER', payload: { name: editName.trim(), phone: editPhone.trim() } });
    setShowEditModal(false);
    Alert.alert(t.saved, 'Profil mis à jour avec succès.');
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert(t.error, 'Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert(t.error, 'Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert(t.error, 'Les mots de passe ne correspondent pas.'); // both fields must match
      return;
    }
    // clear fields so they don't linger in memory
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowSecurityModal(false);
    Alert.alert(t.success, 'Mot de passe modifié avec succès.');
  };

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.logout,
          style: 'destructive', // red on iOS
          onPress: () => {
            dispatch({ type: 'LOGOUT' });
            router.replace('/auth' as any); // replace so user can't go back
          },
        },
      ]
    );
  };

  const LANGUAGES: Array<{ code: 'fr' | 'en' | 'ar'; label: string; abbr: string }> = [
    { code: 'fr', label: 'Français', abbr: 'FR' },
    { code: 'en', label: 'English',  abbr: 'EN' },
    { code: 'ar', label: 'العربية',  abbr: 'AR' },
  ];

  const s = makeStyles(C);

  return (
    <View style={[s.container, { backgroundColor: C.bg }]}>
      <StatusBar style={state.theme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient colors={[C.bg, C.bgElevated, C.bg]} style={StyleSheet.absoluteFill} />

      <View style={[s.header, { paddingTop: insets.top + 8, borderBottomColor: C.border1 }]}>
        <Text style={[s.headerTitle, { color: C.text }]}>{t.profile}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar card */}
        <View style={[s.avatarCard, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
          <View style={[s.avatarCircle, { backgroundColor: C.brand }]}>
            <Text style={s.avatarText}>{user.avatar}</Text>
          </View>
          <View style={s.avatarInfo}>
            <Text style={[s.userName, { color: C.text }]}>{user.name}</Text>
            <Text style={[s.userEmail, { color: C.textSecondary }]}>{user.email}</Text>
            <View style={[s.roleBadge, { backgroundColor: C.brand + '15', borderColor: C.brand + '30' }]}>
              <Text style={[s.roleText, { color: C.brand }]}>{user.role.toUpperCase()}</Text>
            </View>
          </View>
          {/* Pencil button pre-fills the edit modal */}
          <Pressable
            style={[s.editBtn, { backgroundColor: C.surface3, borderColor: C.border2 }]}
            onPress={() => {
              setEditName(user.name);
              setEditPhone(user.phone);
              setShowEditModal(true);
            }}
          >
            <Ionicons name="pencil-outline" size={18} color={C.text} />
          </Pressable>
        </View>

        {/* Accreditation banner */}
        <View style={[s.accredCard, { backgroundColor: C.brand + '10', borderColor: C.brand + '25' }]}>
          <Ionicons name="shield-checkmark-outline" size={18} color={C.brand} />
          <View style={{ flex: 1 }}>
            <Text style={[s.accredLabel, { color: C.brand }]}>ACCRÉDITATION</Text>
            <Text style={[s.accredNum, { color: C.text }]}>{user.accreditation}</Text>
          </View>
          <Ionicons name="copy-outline" size={18} color={C.textTertiary} /> {/* copy hint */}
        </View>

        {/* Language section */}
        <View style={s.section}>
          <Text style={[s.sectionLabel, { color: C.textTertiary }]}>{t.language.toUpperCase()}</Text>
          <View style={[s.sectionCard, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
            {LANGUAGES.map((lang, idx) => (
              <React.Fragment key={lang.code}>
                <Pressable
                  style={s.langRow}
                  onPress={() => dispatch({ type: 'SET_LANGUAGE', payload: lang.code })}
                >
                  {/* Highlighted pill for the active language */}
                  <View style={[s.langAbbrBox, state.language === lang.code && { backgroundColor: C.brand + '20', borderColor: C.brand + '40' }]}>
                    <Text style={[s.langAbbrText, { color: state.language === lang.code ? C.brand : C.textSecondary }]}>{lang.abbr}</Text>
                  </View>
                  <Text style={[s.langLabel, { color: C.text }]}>{lang.label}</Text>
                  {state.language === lang.code ? (
                    <Ionicons name="checkmark-circle" size={20} color={C.brand} />
                  ) : (
                    <View style={[s.radioEmpty, { borderColor: C.border2 }]} /> // empty radio for unselected
                  )}
                </Pressable>
                {idx < LANGUAGES.length - 1 && <View style={[s.divider, { backgroundColor: C.border1 }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Theme section */}
        <View style={s.section}>
          <Text style={[s.sectionLabel, { color: C.textTertiary }]}>{t.theme.toUpperCase()}</Text>
          <View style={[s.sectionCard, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
            {/* Pressing the row does the same as toggling the switch */}
            <Pressable
              style={s.menuRow}
              onPress={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })}
            >
              <View style={[s.menuIconBox, { backgroundColor: C.purple + '15', borderColor: C.purple + '25' }]}>
                <Ionicons name={state.theme === 'dark' ? 'moon-outline' : 'sunny-outline'} size={20} color={C.purple} />
              </View>
              <Text style={[s.menuLabel, { color: C.text }]}>
                {state.theme === 'dark' ? t.darkMode : t.lightMode}
              </Text>
              <Switch
                value={state.theme === 'dark'}
                onValueChange={(val) => dispatch({ type: 'SET_THEME', payload: val ? 'dark' : 'light' })}
                trackColor={{ false: C.border2, true: C.brand + '60' }}
                thumbColor={state.theme === 'dark' ? C.brand : C.textTertiary}
              />
            </Pressable>
          </View>
        </View>

        {/* Notifications section */}
        <View style={s.section}>
          <Text style={[s.sectionLabel, { color: C.textTertiary }]}>{t.notifications.toUpperCase()}</Text>
          <View style={[s.sectionCard, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
            <NotifRow icon="notifications-outline" label={t.notifications}    value={state.notifications}    onChange={(v) => dispatch({ type: 'SET_NOTIFICATIONS',     payload: v })} color={C.teal}   C={C} />
            <View style={[s.divider, { backgroundColor: C.border1 }]} />
            <NotifRow icon="radio-outline"          label={t.liveAlerts}       value={state.liveAlerts}       onChange={(v) => dispatch({ type: 'SET_LIVE_ALERTS',        payload: v })} color={C.orange} C={C} />
            <View style={[s.divider, { backgroundColor: C.border1 }]} />
            <NotifRow icon="bus-outline"             label={t.transportAlerts}  value={state.transportAlerts}  onChange={(v) => dispatch({ type: 'SET_TRANSPORT_ALERTS',   payload: v })} color={C.blue}   C={C} />
          </View>
        </View>

        {/* Account section */}
        <View style={s.section}>
          <Text style={[s.sectionLabel, { color: C.textTertiary }]}>COMPTE</Text>
          <View style={[s.sectionCard, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
            {/* Security / change password */}
            <Pressable style={s.menuRow} onPress={() => setShowSecurityModal(true)}>
              <View style={[s.menuIconBox, { backgroundColor: C.gold + '15', borderColor: C.gold + '25' }]}>
                <Ionicons name="shield-outline" size={20} color={C.gold} />
              </View>
              <Text style={[s.menuLabel, { color: C.text }]}>{t.security}</Text>
              <Ionicons name="chevron-forward" size={18} color={C.textTertiary} />
            </Pressable>
            <View style={[s.divider, { backgroundColor: C.border1 }]} />
            {/* Payment methods → wallet screen */}
            <Pressable style={s.menuRow} onPress={() => router.push('/wallet' as any)}>
              <View style={[s.menuIconBox, { backgroundColor: C.teal + '15', borderColor: C.teal + '25' }]}>
                <Ionicons name="card-outline" size={20} color={C.teal} />
              </View>
              <Text style={[s.menuLabel, { color: C.text }]}>Moyens de paiement</Text>
              <Ionicons name="chevron-forward" size={18} color={C.textTertiary} />
            </Pressable>
            <View style={[s.divider, { backgroundColor: C.border1 }]} />
            {/* Help: shows contact details in an alert */}
            <Pressable
              style={s.menuRow}
              onPress={() => Alert.alert(t.helpSupport, 'Email: support@joj2026.sn\nTél: +221 33 000 0000')}
            >
              <View style={[s.menuIconBox, { backgroundColor: C.blue + '15', borderColor: C.blue + '25' }]}>
                <Ionicons name="help-circle-outline" size={20} color={C.blue} />
              </View>
              <Text style={[s.menuLabel, { color: C.text }]}>{t.helpSupport}</Text>
              <Ionicons name="chevron-forward" size={18} color={C.textTertiary} />
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          style={[s.logoutBtn, { backgroundColor: C.error + '12', borderColor: C.error + '30' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={C.error} />
          <Text style={[s.logoutText, { color: C.error }]}>{t.logout}</Text>
        </Pressable>

        <Text style={[s.version, { color: C.textDim }]}>Birame v1.0.0 · JOJ Dakar 2026</Text>
      </ScrollView>

      {/* Edit profile bottom sheet */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={[s.modal, { backgroundColor: C.bg }]}>
          <LinearGradient colors={[C.bg, C.bgDeep]} style={StyleSheet.absoluteFill} />
          <View style={[s.modalHandle, { backgroundColor: C.border2 }]} />
          <View style={s.modalHeader}>
            <Text style={[s.modalTitle, { color: C.text }]}>{t.editProfile}</Text>
            <Pressable onPress={() => setShowEditModal(false)} style={[s.iconBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
              <Ionicons name="close-outline" size={20} color={C.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={s.modalScroll} keyboardShouldPersistTaps="handled">
            <ModalInput label={t.fullName} value={editName}  onChangeText={setEditName}  C={C} />
            <ModalInput label={t.phone}    value={editPhone} onChangeText={setEditPhone} keyboardType="phone-pad" C={C} />
            <Pressable style={s.saveBtn} onPress={handleSaveProfile}>
              <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={s.saveBtnText}>Enregistrer</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>

      {/* Change password bottom sheet */}
      <Modal
        visible={showSecurityModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSecurityModal(false)}
      >
        <View style={[s.modal, { backgroundColor: C.bg }]}>
          <LinearGradient colors={[C.bg, C.bgDeep]} style={StyleSheet.absoluteFill} />
          <View style={[s.modalHandle, { backgroundColor: C.border2 }]} />
          <View style={s.modalHeader}>
            <Text style={[s.modalTitle, { color: C.text }]}>{t.security}</Text>
            <Pressable onPress={() => setShowSecurityModal(false)} style={[s.iconBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
              <Ionicons name="close-outline" size={20} color={C.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={s.modalScroll} keyboardShouldPersistTaps="handled">
            <Text style={[s.securityNote, { color: C.textSecondary }]}>Modifiez votre mot de passe. Il doit contenir au moins 8 caractères.</Text>
            <ModalInput label="Mot de passe actuel"              value={oldPassword}         onChangeText={setOldPassword}         secureTextEntry C={C} />
            <ModalInput label="Nouveau mot de passe"             value={newPassword}         onChangeText={setNewPassword}         secureTextEntry C={C} />
            <ModalInput label="Confirmer le nouveau mot de passe" value={confirmNewPassword} onChangeText={setConfirmNewPassword}   secureTextEntry C={C} />
            <Pressable style={s.saveBtn} onPress={handleChangePassword}>
              <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={s.saveBtnText}>Modifier le mot de passe</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// Single notification toggle row
function NotifRow({
  icon, label, value, onChange, color, C,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  color: string;
  C: ReturnType<typeof getColors>;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: color + '15', borderWidth: 1, borderColor: color + '25', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: C.text }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: C.border2, true: color + '60' }} // tinted when on
        thumbColor={value ? color : C.textTertiary}
      />
    </View>
  );
}

// Labelled input used inside modals
function ModalInput({
  label,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  C,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  C: ReturnType<typeof getColors>;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary, marginBottom: 6 }}>{label}</Text>
      <TextInput
        style={{
          backgroundColor: C.surface2,
          borderWidth: 1,
          borderColor: C.border2,
          borderRadius: Radius.md,
          paddingHorizontal: 16,
          height: 52,
          fontSize: 15,
          color: C.text,
        }}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry} // hides text for password fields
        placeholderTextColor={C.textTertiary}
      />
    </View>
  );
}

// Returns a fresh StyleSheet every time the theme changes
function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth },
    headerTitle: { fontSize: 21, fontWeight: '800', letterSpacing: -0.3 },
    scroll: { padding: 20, gap: 16 },
    avatarCard: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.lg, padding: 16, gap: 14, borderWidth: 1 },
    avatarCircle: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 20, fontWeight: '900', color: '#fff' },
    avatarInfo: { flex: 1, gap: 4 },
    userName: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
    userEmail: { fontSize: 13, fontWeight: '500' },
    roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1, marginTop: 4 },
    roleText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
    editBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    accredCard: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.lg, padding: 14, gap: 12, borderWidth: 1 },
    accredLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginBottom: 2 },
    accredNum: { fontSize: 13, fontWeight: '700', fontFamily: 'monospace' }, // fixed-width for badge codes
    section: { gap: 8 },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingLeft: 4 },
    sectionCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
    menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    menuIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    divider: { height: StyleSheet.hairlineWidth, marginLeft: 66 }, // indented past the icon
    langRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    langAbbrBox: { width: 38, height: 28, borderRadius: 8, backgroundColor: C.surface3, borderWidth: 1, borderColor: C.border2, alignItems: 'center', justifyContent: 'center' },
    langAbbrText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    langLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    radioEmpty: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5 }, // unselected radio
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: Radius.lg, borderWidth: 1 },
    logoutText: { fontSize: 15, fontWeight: '700' },
    version: { textAlign: 'center', fontSize: 12, fontWeight: '500', marginTop: 4 },
    modal: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 21, fontWeight: '800' },
    modalScroll: { paddingBottom: 60, gap: 4 },
    iconBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    saveBtn: { height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 8 }, // overflow clips gradient
    saveBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
    securityNote: { fontSize: 13, lineHeight: 18, marginBottom: 16 },
  });
}
