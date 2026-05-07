import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Colors, Typography, Radius, Shadows } from '../theme';
import { USER } from '../data/mock';

const LANGUAGES = [
  { code: 'FR', label: 'Français', active: true },
  { code: 'EN', label: 'English', active: false },
  { code: 'AR', label: 'العربية', active: false },
  { code: 'WO', label: 'Wolof', active: false },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifLive, setNotifLive] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [activeLang, setActiveLang] = useState('FR');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#050A18', '#0D0B2E', '#050A18']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.blob1} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,10,24,0.5)' }]} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profil</Text>
          <Pressable style={styles.editBtn}>
            <Ionicons name="create-outline" size={20} color={Colors.text} />
          </Pressable>
        </View>
        <View style={styles.headerBorder} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity card */}
        <GlassCard style={styles.idCard} variant="strong">
          <LinearGradient
            colors={['rgba(123,94,167,0.35)', 'rgba(61,142,245,0.15)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.idContent}>
            <View style={styles.avatarWrap}>
              <LinearGradient
                colors={[Colors.orange, Colors.orangeLight]}
                style={styles.avatar}
              >
                <Text style={styles.avatarInitial}>
                  {USER.name.split(' ').map((n) => n[0]).join('')}
                </Text>
              </LinearGradient>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarBadgeText}>✓</Text>
              </View>
            </View>

            <View style={styles.idInfo}>
              <Text style={styles.idName}>{USER.name}</Text>
              <View style={styles.idRow}>
                <Text style={styles.idFlag}>{USER.flag}</Text>
                <Text style={styles.idCountry}>{USER.country}</Text>
              </View>
              <View style={styles.idRoleBadge}>
                <Text style={styles.idRole}>{USER.role}</Text>
              </View>
            </View>

            <Pressable style={styles.qrBtn}>
              <Ionicons name="qr-code-outline" size={28} color={Colors.text} />
            </Pressable>
          </View>

          <View style={styles.idBottom}>
            <View style={styles.idNumWrap}>
              <Text style={styles.idNumLabel}>N° ACCRÉDITATION</Text>
              <Text style={styles.idNum}>{USER.accreditation}</Text>
            </View>
            <View style={styles.idStatus}>
              <View style={styles.idStatusDot} />
              <Text style={styles.idStatusText}>VÉRIFIÉ</Text>
            </View>
          </View>
        </GlassCard>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatItem label="Événements" value="3" icon="🎫" />
          <StatItem label="Transport" value="2" icon="🚗" />
          <StatItem label="Dépenses" value="24K" icon="💳" />
        </View>

        {/* Language */}
        <Text style={styles.sectionLabel}>LANGUE D'INTERFACE</Text>
        <GlassCard style={styles.langCard} variant="subtle">
          <View style={styles.langGrid}>
            {LANGUAGES.map((l) => (
              <Pressable
                key={l.code}
                style={[styles.langChip, l.code === activeLang && styles.langChipActive]}
                onPress={() => setActiveLang(l.code)}
              >
                {l.code === activeLang && (
                  <LinearGradient
                    colors={[Colors.purple, Colors.purpleLight]}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <Text style={[styles.langChipCode, l.code === activeLang && { color: '#fff' }]}>
                  {l.code}
                </Text>
                <Text style={[styles.langChipLabel, l.code === activeLang && { color: 'rgba(255,255,255,0.8)' }]}>
                  {l.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </GlassCard>

        {/* Notifications */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <GlassCard style={styles.settingsCard} variant="subtle">
          <ToggleRow
            icon="notifications-outline"
            label="Notifications push"
            sub="Alertes événements & changements"
            value={notifPush}
            onChange={setNotifPush}
            color={Colors.orange}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="chatbubble-outline"
            label="SMS d'alerte"
            sub="Urgences et annulations"
            value={notifSms}
            onChange={setNotifSms}
            color={Colors.teal}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="flash-outline"
            label="Scores en direct"
            sub="Résultats et finales"
            value={notifLive}
            onChange={setNotifLive}
            color={Colors.error}
          />
        </GlassCard>

        {/* Accessibility */}
        <Text style={styles.sectionLabel}>ACCESSIBILITÉ</Text>
        <GlassCard style={styles.settingsCard} variant="subtle">
          <ToggleRow
            icon="contrast-outline"
            label="Mode contraste élevé"
            sub="Améliore la lisibilité"
            value={highContrast}
            onChange={setHighContrast}
            color={Colors.blue}
          />
        </GlassCard>

        {/* Menu items */}
        <Text style={styles.sectionLabel}>MON COMPTE</Text>
        <GlassCard style={styles.menuCard} variant="subtle">
          {MENU_ITEMS.map((item, i) => (
            <View key={item.label}>
              <MenuRow item={item} />
              {i < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </GlassCard>

        {/* Logout */}
        <GlassButton
          title="Se déconnecter"
          onPress={() => router.replace('/auth')}
          variant="danger"
          fullWidth
          size="lg"
          icon={<Ionicons name="log-out-outline" size={20} color="#fff" />}
        />

        <Text style={styles.version}>JOJ SuperApp v1.0.0 · Jeux de la Francophonie</Text>
      </ScrollView>
    </View>
  );
}

function StatItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <GlassCard style={styles.statCard} variant="subtle">
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </GlassCard>
  );
}

function ToggleRow({
  icon,
  label,
  sub,
  value,
  onChange,
  color,
}: {
  icon: any;
  label: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
  color: string;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={[styles.toggleIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.glass3, true: color + '80' }}
        thumbColor={value ? color : Colors.textTertiary}
      />
    </View>
  );
}

function MenuRow({ item }: { item: (typeof MENU_ITEMS)[0] }) {
  return (
    <Pressable style={styles.menuRow}>
      <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={18} color={item.color} />
      </View>
      <Text style={styles.menuLabel}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
    </Pressable>
  );
}

const MENU_ITEMS = [
  { icon: 'person-circle-outline', label: 'Modifier mon profil', color: Colors.purple },
  { icon: 'shield-checkmark-outline', label: 'Sécurité & biométrie', color: Colors.blue },
  { icon: 'card-outline', label: 'Mes moyens de paiement', color: Colors.gold },
  { icon: 'location-outline', label: 'Accès & zones', color: Colors.teal },
  { icon: 'help-circle-outline', label: 'Aide & support', color: Colors.orange },
  { icon: 'document-text-outline', label: 'Mentions légales', color: Colors.textTertiary },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  blob1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: Colors.purple + '10', top: 80, right: -60 },
  header: { overflow: 'hidden' },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14 },
  headerTitle: { ...Typography.title2, fontWeight: '800' },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  headerBorder: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1 },
  scroll: { padding: 20, gap: 12 },
  idCard: { overflow: 'hidden', padding: 20, gap: 16 },
  idContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 24, fontWeight: '800', color: '#fff' },
  avatarBadge: { position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  avatarBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  idInfo: { flex: 1, gap: 4 },
  idName: { ...Typography.title3, fontWeight: '800' },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  idFlag: { fontSize: 16 },
  idCountry: { ...Typography.footnote, color: Colors.textSecondary },
  idRoleBadge: { alignSelf: 'flex-start', backgroundColor: Colors.purple + '25', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: Colors.purple + '40' },
  idRole: { ...Typography.caption, color: Colors.purpleLight, fontWeight: '700' },
  qrBtn: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  idBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border1 },
  idNumWrap: { gap: 2 },
  idNumLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: Colors.textTertiary, textTransform: 'uppercase' },
  idNum: { ...Typography.footnote, color: Colors.textSecondary, fontFamily: 'monospace' },
  idStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  idStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  idStatusText: { fontSize: 10, fontWeight: '700', color: Colors.success, letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 4 },
  statIcon: { fontSize: 22 },
  statValue: { ...Typography.title2, fontWeight: '900' },
  statLabel: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center' },
  sectionLabel: { ...Typography.label, color: Colors.textTertiary, marginTop: 4 },
  langCard: { padding: 14 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border1, backgroundColor: Colors.glass1, overflow: 'hidden', alignItems: 'center', gap: 2 },
  langChipCode: { ...Typography.footnote, fontWeight: '800', color: Colors.textSecondary },
  langChipLabel: { ...Typography.caption, color: Colors.textTertiary },
  settingsCard: { gap: 0 },
  menuCard: { gap: 0 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1, marginHorizontal: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  toggleIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toggleInfo: { flex: 1, gap: 2 },
  toggleLabel: { ...Typography.callout, fontWeight: '600' },
  toggleSub: { ...Typography.caption, color: Colors.textTertiary },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { ...Typography.callout, fontWeight: '500', flex: 1 },
  version: { ...Typography.caption, color: Colors.textDim, textAlign: 'center', marginTop: 8 },
});
