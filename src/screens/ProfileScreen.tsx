import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CountryBadge from '../components/CountryBadge';
import { Colors, Typography, Radius } from '../theme';
import { useApp } from '../context/AppContext';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

// Supported interface languages shown in the language picker
const LANGUAGES = [
  { code: 'FR', label: 'Français' },
  { code: 'EN', label: 'English' },
  { code: 'AR', label: 'العربية' },
  { code: 'WO', label: 'Wolof' },
];

// Account menu items — each links to a different settings area
const MENU_ITEMS: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}> = [
  { icon: 'person-circle-outline',   label: 'Modifier mon profil',  color: Colors.purple      },
  { icon: 'shield-checkmark-outline',label: 'Sécurité & biométrie', color: Colors.blue        },
  { icon: 'card-outline',            label: 'Moyens de paiement',   color: Colors.gold        },
  { icon: 'location-outline',        label: 'Accès & zones',        color: Colors.teal        },
  { icon: 'help-circle-outline',     label: 'Aide & support',       color: Colors.brand       },
  { icon: 'document-text-outline',   label: 'Mentions légales',     color: Colors.textTertiary},
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { state, dispatch, logout } = useApp();
  const user = state.user;

  const [activeLang, setActiveLang] = useState('FR');

 
  const ticketCount = 4;
  const tripCount   = 12;

  // Sum all debit transactions, divide by 1000 to get "K" units (e.g. 12 000 → 12K)
  const spentK = Math.floor(
    state.transactions
      .filter((t) => t.type === 'debit')
      .reduce((s, t) => s + t.amount, 0)
    / 1000
  );

 
  const STATS = [
    { id: 'tickets',   icon: 'ticket-outline' as const, label: 'Billets',  value: String(ticketCount), color: Colors.brand },
    { id: 'transport', icon: 'car-outline'    as const, label: 'Trajets',  value: String(tripCount),   color: Colors.teal  },
    { id: 'spending',  icon: 'wallet-outline' as const, label: 'Dépenses', value: spentK > 0 ? `${spentK}K` : '0', color: Colors.gold },
  ];

 
  const handleLogout = async () => {
    await logout();
  };

 
  if (!user) return null;

  return (
    <View style={styles.container}>

      {/* Force light icons on the status bar — ID card has a dark gradient */}
      <StatusBar style="light" />

      {/* Full-screen background gradient, same depth trick as HomeScreen */}
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bg]} style={StyleSheet.absoluteFill} />

      {/* Sticky header — sits above the scroll area */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profil</Text>
          {/* Edit button — top-right pencil icon */}
          <Pressable style={styles.iconBtn}>
            <Ionicons name="create-outline" size={20} color={Colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Main scrollable body */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── ID CARD: gradient accreditation card with avatar, name, QR button ── */}
        <View style={styles.idCard}>

          {/* Brand gradient fill for the whole card */}
          <LinearGradient colors={[Colors.brand, Colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

          {/* Top row: avatar, user info column, QR code button */}
          <View style={styles.idTop}>

            {/* Avatar circle with initials */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.avatar}</Text>
              {/* Green checkmark badge overlaid on the bottom-right of the avatar */}
              <View style={styles.avatarVerified}>
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            </View>

            {/* Name + country flag + role badge */}
            <View style={{ flex: 1 }}>
              <Text style={styles.idName}>{user.name}</Text>
              <View style={styles.idMeta}>
                <CountryBadge code={user.countryCode} size="sm" /> {/* small flag chip */}
                <Text style={styles.idCountry}>{user.country}</Text>
              </View>
              {/* Role pill (e.g. "Athlète") */}
              <View style={styles.idRoleBadge}>
                <Ionicons name="person-outline" size={11} color="#fff" />
                <Text style={styles.idRole}>{user.role}</Text>
              </View>
            </View>

            {/* QR code button — tapping it would show the user's QR for scanning */}
            <Pressable style={styles.qrBtn}>
              <Ionicons name="qr-code-outline" size={26} color="#fff" />
            </Pressable>
          </View>

          {/* Thin white divider line between card top and bottom sections */}
          <View style={styles.idDivider} />

          {/* Bottom row: accreditation number + verified status */}
          <View style={styles.idBottom}>
            <View>
              <Text style={styles.idLabel}>N° ACCRÉDITATION</Text> {/* tiny uppercase label */}
              <Text style={styles.idNum}>{user.accreditation}</Text> {/* monospace ID number */}
            </View>
            {/* Green "VÉRIFIÉ" badge on the right */}
            <View style={styles.idStatus}>
              <View style={styles.idStatusDot} /> {/* small green dot */}
              <Text style={styles.idStatusText}>VÉRIFIÉ</Text>
            </View>
          </View>
        </View>

        {/* ── EMAIL ROW: small icon + email address below the card ── */}
        <View style={styles.emailRow}>
          <Ionicons name="mail-outline" size={16} color={Colors.textTertiary} />
          <Text style={styles.emailText}>{user.email}</Text>
        </View>

        {/* ── STATS ROW: tickets, trips, spending in three equal cards ── */}
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.id} style={styles.statCard}>
              {/* Colored icon box with tinted background */}
              <View style={[styles.statIcon, { backgroundColor: s.color + '15', borderColor: s.color + '30' }]}>
                <Ionicons name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text> {/* big number */}
              <Text style={styles.statLabel}>{s.label}</Text> {/* label below */}
            </View>
          ))}
        </View>

        {/* ── JOJ POINTS CARD: shows loyalty point balance ── */}
        <View style={styles.pointsCard}>
          {/* Subtle gold gradient background — horizontal, left to right */}
          <LinearGradient colors={[Colors.gold + '30', Colors.gold + '10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          <View style={styles.pointsLeft}>
            <Ionicons name="star" size={22} color={Colors.gold} /> {/* gold star icon */}
            <View>
              <Text style={styles.pointsValue}>{state.jojPoints.toLocaleString('fr-FR')} pts</Text>
              <Text style={styles.pointsSub}>JOJ Points · 100 XOF dépensés = 1 pt</Text> {/* conversion hint */}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} /> {/* tappable hint */}
        </View>

        {/* ── LANGUAGE PICKER ── */}
        <Text style={styles.sectionLabel}>LANGUE D'INTERFACE</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map((l) => (
           
            <Pressable
              key={l.code}
              onPress={() => setActiveLang(l.code)}
              style={[styles.langChip, l.code === activeLang && styles.langChipActive]}
            >
              <Text style={[styles.langCode, l.code === activeLang && styles.langCodeActive]}>{l.code}</Text>
              <Text style={[styles.langLabel, l.code === activeLang && styles.langLabelActive]}>{l.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── NOTIFICATION TOGGLES ── */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <View style={styles.settingsCard}>
          <ToggleRow
            icon="notifications-outline"
            label="Notifications push"
            sub="Alertes événements & changements"
            value={state.notifications}
            onChange={(v) => dispatch({ type: 'SET_NOTIFICATIONS', payload: v })}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="flash-outline"
            label="Scores en direct"
            sub="Résultats et finales"
            value={state.liveAlerts}
            onChange={(v) => dispatch({ type: 'SET_LIVE_ALERTS', payload: v })}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="bus-outline"
            label="Alertes transport"
            sub="Navettes et modifications"
            value={state.transportAlerts}
            onChange={(v) => dispatch({ type: 'SET_TRANSPORT_ALERTS', payload: v })}
          />
        </View>

        {/* ── ACCOUNT MENU ── */}
        <Text style={styles.sectionLabel}>MON COMPTE</Text>
        <View style={styles.settingsCard}>
          {MENU_ITEMS.map((m, i) => (
            <View key={m.label}>
              <Pressable style={styles.menuRow}>
                {/* Colored icon box with tinted background matching the item's accent color */}
                <View style={[styles.menuIcon, { backgroundColor: m.color + '18', borderColor: m.color + '25' }]}>
                  <Ionicons name={m.icon} size={18} color={m.color} />
                </View>
                <Text style={styles.menuLabel}>{m.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} /> {/* navigate hint */}
              </Pressable>
              {/* Divider after every row except the last */}
              {i < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ── LOGOUT BUTTON ── */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>

        {/* App version string at the very bottom */}
        <Text style={styles.version}>JOJ SuperApp v1.0.0  ·  Dakar 2026</Text>
      </ScrollView>
    </View>
  );
}

// ─── TOGGLE ROW SUB-COMPONENT ─────────────────────────────────────────────────

// Reusable row with an icon, label, subtitle, and a toggle switch
function ToggleRow({
  icon, label, sub, value, onChange,
}: {
  icon: any;
  label: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      {/* Icon box on the left */}
      <View style={styles.toggleIcon}>
        <Ionicons name={icon} size={18} color={Colors.textSecondary} />
      </View>
      {/* Label + subtitle in the middle */}
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSub}>{sub}</Text>
      </View>
      {/* Native switch on the right — brand color when on */}
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.surface3, true: Colors.brand }}
        thumbColor="#fff"
        ios_backgroundColor={Colors.surface3}
      />
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

 
  container: { flex: 1, backgroundColor: Colors.bg },

 
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { ...Typography.title2, fontWeight: '800' },
  iconBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },

 
  scroll: { padding: 20, gap: 12 },

 
  idCard: { borderRadius: Radius.xl, padding: 20, gap: 16, overflow: 'hidden' },
  idTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },

 
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.20)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.30)' },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  avatarVerified: { position: 'absolute', bottom: -3, right: -3, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },

 
  idName: { fontSize: 18, fontWeight: '800', color: '#fff' },
  idMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  idCountry: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  idRoleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 6, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  idRole: { fontSize: 11, fontWeight: '700', color: '#fff' },

 
  qrBtn: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },

 
  idDivider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.20)' },

 
  idBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: 'rgba(255,255,255,0.7)' },
  idNum: { fontSize: 13, color: '#fff', fontFamily: 'monospace', marginTop: 2, letterSpacing: 0.5 },
  idStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  idStatusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5BFF8E' },
  idStatusText: { fontSize: 10, fontWeight: '800', color: '#5BFF8E', letterSpacing: 0.5 }, // "VÉRIFIÉ"

 
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  emailText: { fontSize: 13, color: Colors.textTertiary },

 
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, alignItems: 'center', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 14, gap: 6 },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  statValue: { fontSize: 20, fontWeight: '900', color: Colors.text },
  statLabel: { ...Typography.caption, color: Colors.textTertiary },

 
  pointsCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.gold + '40', borderRadius: Radius.lg, padding: 16, overflow: 'hidden' },
  pointsLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  pointsValue: { fontSize: 18, fontWeight: '800', color: Colors.gold },
  pointsSub: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },

 
  sectionLabel: { ...Typography.label, marginTop: 8, marginBottom: 4 },

 
  langGrid: { flexDirection: 'row', gap: 8 },
  langChip: { flex: 1, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.md, padding: 12, alignItems: 'center', gap: 4 },
  langChipActive: { backgroundColor: Colors.brand + '15', borderColor: Colors.brand + '50' },
  langCode: { fontSize: 14, fontWeight: '800', color: Colors.textSecondary }, // "FR", "EN", etc.
  langCodeActive: { color: Colors.brand },
  langLabel: { fontSize: 11, color: Colors.textTertiary },
  langLabelActive: { color: Colors.text },

 
  settingsCard: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, overflow: 'hidden' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1, marginHorizontal: 14 },

 
  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  toggleIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surface3, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  toggleInfo: { flex: 1, gap: 2 },
  toggleLabel: { ...Typography.callout, fontWeight: '600' },
  toggleSub: { ...Typography.caption, color: Colors.textTertiary },

 
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  menuLabel: { ...Typography.callout, fontWeight: '500', flex: 1 },

 
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: Radius.lg, backgroundColor: Colors.error + '12', borderWidth: 1, borderColor: Colors.error + '25', marginTop: 8 },
  logoutText: { ...Typography.callout, fontWeight: '700', color: Colors.error },

 
  version: { ...Typography.caption, color: Colors.textDim, textAlign: 'center', marginTop: 8 },
});
