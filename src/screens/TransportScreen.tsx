import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radius } from '../theme';
import { TRANSPORT } from '../data/mock';

// three views: overview, yango ride-hailing, official shuttles
type Tab = 'overview' | 'yango' | 'shuttles';

// venue shortcuts shown in the Yango quick-destinations row
const VENUES = [
  { name: 'Stade LSS', icon: 'football-outline' as const, dist: '7.8 km' },
  { name: 'Dakar Arena', icon: 'basketball-outline' as const, dist: '4.2 km' },
  { name: 'AIBD', icon: 'airplane-outline' as const, dist: '45 km' },
  { name: 'Village JOJ', icon: 'home-outline' as const, dist: '2.1 km' },
  { name: 'Médias', icon: 'newspaper-outline' as const, dist: '5.5 km' },
];

// static shuttle timetable data
const SHUTTLE_ROUTES = [
  { id: 'S1', name: 'Route A — Centre', from: 'AIBD', to: 'Dakar Centre', available: 24, departures: ['14:35', '15:05', '15:35', '16:05'] },
  { id: 'S2', name: 'Route B — Stade LSS', from: 'Village JOJ', to: 'Stade LSS', available: 8, departures: ['15:00', '15:30', '16:00', '16:30'] },
  { id: 'S3', name: 'Route C — Arena', from: 'Hôtel Roi du Lac', to: 'Dakar Arena', available: 18, departures: ['13:45', '14:15', '14:45'] },
];

export default function TransportScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bg]} style={StyleSheet.absoluteFill} /> {/* bg gradient layer */}

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Transport</Text>
        <View style={styles.tabs}>
          <TabBtn active={tab === 'overview'} onPress={() => setTab('overview')} icon="grid-outline" label="Vue" />
          <TabBtn active={tab === 'yango'} onPress={() => setTab('yango')} icon="car-outline" label="Yango" />
          <TabBtn active={tab === 'shuttles'} onPress={() => setTab('shuttles')} icon="bus-outline" label="Navettes" />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        {tab === 'overview' && <Overview />}
        {tab === 'yango' && <YangoTab />}
        {tab === 'shuttles' && <ShuttlesTab />}
      </ScrollView>
    </View>
  );
}

// small pill-style tab button
function TabBtn({ active, onPress, icon, label }: { active: boolean; onPress: () => void; icon: any; label: string }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Ionicons name={icon} size={15} color={active ? Colors.text : Colors.textTertiary} />
      <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{label}</Text>
    </Pressable>
  );
}

// overview tab: map card, status pills, transport list, emergency
function Overview() {
  return (
    <>
      <View style={styles.mapCard}>
        <LinearGradient colors={[Colors.teal + '30', Colors.blue + '15']} style={StyleSheet.absoluteFill} /> {/* teal tint over card */}
        <View style={styles.mapContent}>
          <View style={styles.mapIconRing}>
            <Ionicons name="map-outline" size={36} color={Colors.teal} />
          </View>
          <Text style={styles.mapTitle}>Carte des transports</Text>
          <Text style={styles.mapSub}>Toutes les options en un coup d'œil</Text>
          <Pressable style={styles.mapBtn}>
            <Ionicons name="navigate" size={14} color="#fff" />
            <Text style={styles.mapBtnText}>Ouvrir la carte</Text>
          </Pressable>
        </View>
      </View>

      {/* three quick status indicators at a glance */}
      <View style={styles.statusGrid}>
        <StatusPill icon="bus-outline" label="Navettes" status="EN SERVICE" color={Colors.success} />
        <StatusPill icon="car-outline" label="Yango" status="DISPONIBLE" color={Colors.teal} />
        <StatusPill icon="airplane-outline" label="AIBD" status="NORMAL" color={Colors.blue} />
      </View>

      <Text style={styles.sectionLabel}>OPTIONS DE TRANSPORT</Text>
      {TRANSPORT.map((t) => <TransportRow key={t.id} t={t} />)} {/* one row per transport option */}

      {/* emergency transport section at the bottom */}
      <View style={styles.emergency}>
        <View style={styles.emergencyIcon}>
          <Ionicons name="warning-outline" size={20} color={Colors.error} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.emergencyTitle}>Transport d'urgence</Text>
          <Text style={styles.emergencySub}>Médical · Sécurité · Évacuation</Text>
        </View>
        <Pressable style={styles.emergencyBtn}>
          <Ionicons name="call" size={14} color="#fff" />
          <Text style={styles.emergencyBtnText}>Appeler</Text>
        </Pressable>
      </View>
    </>
  );
}

// single transport option row with name, route, and detail info
function TransportRow({ t }: { t: (typeof TRANSPORT)[0] }) {
  return (
    <Pressable style={styles.transportRow}>
      <View style={styles.transportIcon}>
        <Ionicons name={t.icon} size={22} color={Colors.brand} />
      </View>
      <View style={styles.transportInfo}>
        <Text style={styles.transportName}>{t.name}</Text>
        <View style={styles.transportRoute}>
          <Text style={styles.transportRouteText} numberOfLines={1}>{t.from}</Text>
          <Ionicons name="arrow-forward" size={11} color={Colors.textTertiary} />
          <Text style={styles.transportRouteText} numberOfLines={1}>{t.to}</Text>
        </View>
        {/* yango shows fare estimate, shuttles show next departure */}
        <Text style={styles.transportDetail}>
          {t.type === 'yango' ? `${(t as any).estimate}  ·  ${(t as any).price}` : `Prochain ${(t as any).nextDeparture}  ·  ${(t as any).duration}`}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
    </Pressable>
  );
}

// small colored status badge used in the status grid
function StatusPill({ icon, label, status, color }: { icon: any; label: string; status: string; color: string }) {
  return (
    <View style={[styles.statusPill, { borderColor: color + '30' }]}>
      <View style={[styles.statusPillIcon, { backgroundColor: color + '18' }]}> {/* tinted icon bg */}
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.statusPillLabel}>{label}</Text>
      <Text style={[styles.statusPillStatus, { color }]}>{status}</Text>
    </View>
  );
}

// yango ride-booking tab
function YangoTab() {
  return (
    <>
      {/* branded hero banner for Yango partnership */}
      <View style={styles.yangoHero}>
        <LinearGradient colors={[Colors.brand, Colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.yangoHeroContent}>
          <View style={styles.yangoHeroIcon}>
            <Ionicons name="car-sport" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.yangoTitle}>Yango Ride</Text>
            <Text style={styles.yangoSub}>Partenaire officiel JOJ 2026</Text>
          </View>
          <View style={styles.yangoBadge}>
            <View style={styles.yangoDot} /> {/* green dot = service active */}
            <Text style={styles.yangoBadgeText}>ACTIF</Text>
          </View>
        </View>
      </View>

      {/* route input card with visual indicator line */}
      <View style={styles.routeCard}>
        <View style={styles.routeIndicator}>
          <View style={[styles.routePoint, { backgroundColor: Colors.brand }]} /> {/* departure dot */}
          <View style={styles.routeLine} /> {/* connecting line */}
          <View style={[styles.routePoint, { backgroundColor: Colors.teal }]} /> {/* destination dot */}
        </View>
        <View style={styles.routeInputs}>
          <Pressable style={styles.routeInput}>
            <Text style={styles.routeInputLabel}>Départ</Text>
            <Text style={styles.routeInputValue}>Ma position actuelle</Text>
          </Pressable>
          <View style={styles.routeDivider} />
          <Pressable style={styles.routeInput}>
            <Text style={styles.routeInputLabel}>Destination</Text>
            <Text style={[styles.routeInputValue, { color: Colors.textTertiary }]}>Choisir une destination</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionLabel}>DESTINATIONS RAPIDES</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
        {VENUES.map((v) => (
          <Pressable key={v.name} style={styles.venueChip}>
            <View style={styles.venueIconBox}>
              <Ionicons name={v.icon} size={20} color={Colors.text} />
            </View>
            <Text style={styles.venueName}>{v.name}</Text>
            <Text style={styles.venueDist}>{v.dist}</Text> {/* distance from user */}
          </Pressable>
        ))}
      </ScrollView>

      {/* fare and availability summary before booking */}
      <View style={styles.estimate}>
        <View style={styles.estimateRow}>
          <EstimateItem label="Attente" value="8 min" />
          <View style={styles.estimateDivider} />
          <EstimateItem label="Tarif estimé" value="2 500 XOF" />
          <View style={styles.estimateDivider} />
          <EstimateItem label="Disponibles" value="3" />
        </View>
        <Pressable style={styles.bookBtn}>
          <LinearGradient colors={[Colors.brand, Colors.brandLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <Ionicons name="car" size={18} color="#fff" />
          <Text style={styles.bookBtnText}>Réserver un Yango</Text>
        </Pressable>
      </View>
    </>
  );
}

// single estimate stat, label below value
function EstimateItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.estimateItem}>
      <Text style={styles.estimateValue}>{value}</Text>
      <Text style={styles.estimateLabel}>{label}</Text>
    </View>
  );
}

// official shuttle timetable tab
function ShuttlesTab() {
  return (
    <>
      {/* info banner explaining who can use shuttles */}
      <View style={styles.shuttleInfo}>
        <View style={styles.shuttleInfoIcon}>
          <Ionicons name="information-circle" size={20} color={Colors.teal} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.shuttleInfoTitle}>Navettes officielles</Text>
          <Text style={styles.shuttleInfoSub}>Service gratuit pour tous les accrédités. Fréquence renforcée lors des finales.</Text>
        </View>
      </View>

      {SHUTTLE_ROUTES.map((r) => <ShuttleCard key={r.id} route={r} />)}
    </>
  );
}

// card for one shuttle route with departure times
function ShuttleCard({ route }: { route: (typeof SHUTTLE_ROUTES)[0] }) {
  const seats = route.available > 10 ? 'good' : 'low';
  return (
    <View style={styles.shuttleCard}>
      <View style={styles.shuttleHeader}>
        <View style={styles.shuttleIconBox}>
          <Ionicons name="bus-outline" size={20} color={Colors.brand} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.shuttleName}>{route.name}</Text>
          <View style={styles.shuttleRoute}>
            <Text style={styles.shuttleRouteText}>{route.from}</Text>
            <Ionicons name="arrow-forward" size={10} color={Colors.textTertiary} />
            <Text style={styles.shuttleRouteText}>{route.to}</Text>
          </View>
        </View>
        {/* seat count badge, green when plenty, orange when low */}
        <View style={[styles.seatsBadge, seats === 'good' ? styles.seatsGood : styles.seatsLow]}>
          <Ionicons name="people-outline" size={11} color={seats === 'good' ? Colors.success : Colors.warning} />
          <Text style={[styles.seatsText, { color: seats === 'good' ? Colors.success : Colors.warning }]}>{route.available}</Text>
        </View>
      </View>
      <View style={styles.deptRow}>
        {route.departures.map((d, i) => (
         
          <Pressable key={i} style={[styles.deptChip, i === 0 && styles.deptChipNext]}>
            <Text style={[styles.deptTime, i === 0 && { color: '#fff' }]}>{d}</Text>
            {i === 0 && <Text style={styles.deptNext}>PROCHAIN</Text>} {/* label next departure */}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border1, gap: 12 },
  headerTitle: { ...Typography.title2, fontWeight: '800' },
  tabs: { flexDirection: 'row', gap: 6 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.surface1, borderWidth: 1, borderColor: Colors.border1 },
  tabBtnActive: { backgroundColor: Colors.surface3, borderColor: Colors.border2 },
  tabBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textTertiary },
  tabBtnTextActive: { color: Colors.text },
  scroll: { padding: 16, gap: 10 },

  mapCard: { borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, marginBottom: 4 },
  mapContent: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  mapIconRing: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.surface3, borderWidth: 1, borderColor: Colors.teal + '30', alignItems: 'center', justifyContent: 'center' },
  mapTitle: { ...Typography.title3, fontWeight: '700' },
  mapSub: { ...Typography.footnote, color: Colors.textSecondary },
  mapBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 9, borderRadius: Radius.full, backgroundColor: Colors.teal, marginTop: 6 },
  mapBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  statusGrid: { flexDirection: 'row', gap: 10 },
  statusPill: { flex: 1, alignItems: 'center', padding: 12, borderRadius: Radius.md, backgroundColor: Colors.surface2, borderWidth: 1, gap: 6 },
  statusPillIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statusPillLabel: { ...Typography.caption, fontWeight: '700', color: Colors.textSecondary },
  statusPillStatus: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  sectionLabel: { ...Typography.label, marginTop: 8, marginBottom: 4 },

  transportRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 14, gap: 12 },
  transportIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.brand + '15', borderWidth: 1, borderColor: Colors.brand + '25', alignItems: 'center', justifyContent: 'center' },
  transportInfo: { flex: 1, gap: 4 },
  transportName: { ...Typography.callout, fontWeight: '700' },
  transportRoute: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  transportRouteText: { ...Typography.caption, color: Colors.textSecondary, flexShrink: 1 },
  transportDetail: { ...Typography.caption, color: Colors.textTertiary },

  emergency: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.error + '12', borderWidth: 1, borderColor: Colors.error + '25', borderRadius: Radius.lg, padding: 14, gap: 12, marginTop: 8 },
  emergencyIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.error + '20', alignItems: 'center', justifyContent: 'center' },
  emergencyTitle: { ...Typography.callout, fontWeight: '700' },
  emergencySub: { ...Typography.caption, color: Colors.textSecondary },
  emergencyBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.error },
  emergencyBtnText: { fontSize: 12, fontWeight: '800', color: '#fff' },

 
  yangoHero: { borderRadius: Radius.lg, overflow: 'hidden' },
  yangoHeroContent: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18 },
  yangoHeroIcon: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  yangoTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  yangoSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  yangoBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.20)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  yangoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  yangoBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  routeCard: { flexDirection: 'row', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 16, gap: 12 },
  routeIndicator: { alignItems: 'center', paddingTop: 18 },
  routePoint: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  routeLine: { width: 2, flex: 1, backgroundColor: Colors.border2, marginVertical: 4, minHeight: 28 },
  routeInputs: { flex: 1 },
  routeInput: { paddingVertical: 12, gap: 2 },
  routeInputLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: Colors.textTertiary, textTransform: 'uppercase' },
  routeInputValue: { ...Typography.callout, fontWeight: '600' },
  routeDivider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1 },

  venueChip: { width: 110, height: 100, borderRadius: Radius.md, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, padding: 12, gap: 6, alignItems: 'center', justifyContent: 'center' },
  venueIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surface3, alignItems: 'center', justifyContent: 'center' },
  venueName: { ...Typography.caption, fontWeight: '700', textAlign: 'center' },
  venueDist: { fontSize: 10, color: Colors.textTertiary },

  estimate: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 18, gap: 14, marginTop: 4 },
  estimateRow: { flexDirection: 'row', alignItems: 'center' },
  estimateItem: { flex: 1, alignItems: 'center', gap: 4 },
  estimateDivider: { width: StyleSheet.hairlineWidth, height: 36, backgroundColor: Colors.border1 },
  estimateValue: { ...Typography.title3, fontWeight: '800' },
  estimateLabel: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center' },
  bookBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: Radius.md, overflow: 'hidden' },
  bookBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

 
  shuttleInfo: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.teal + '10', borderWidth: 1, borderColor: Colors.teal + '25', borderRadius: Radius.lg, padding: 14, gap: 12 },
  shuttleInfoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.teal + '20', alignItems: 'center', justifyContent: 'center' },
  shuttleInfoTitle: { ...Typography.callout, fontWeight: '700' },
  shuttleInfoSub: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },

  shuttleCard: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 16, gap: 14 },
  shuttleHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shuttleIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.brand + '15', borderWidth: 1, borderColor: Colors.brand + '25', alignItems: 'center', justifyContent: 'center' },
  shuttleName: { ...Typography.callout, fontWeight: '700' },
  shuttleRoute: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  shuttleRouteText: { ...Typography.caption, color: Colors.textSecondary },
  seatsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
  seatsGood: { backgroundColor: Colors.success + '15', borderColor: Colors.success + '30' },
  seatsLow: { backgroundColor: Colors.warning + '15', borderColor: Colors.warning + '30' },
  seatsText: { fontSize: 11, fontWeight: '800' },
  deptRow: { flexDirection: 'row', gap: 8 },
  deptChip: { flex: 1, height: 50, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface1, borderWidth: 1, borderColor: Colors.border1, gap: 2 },
  deptChipNext: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  deptTime: { ...Typography.callout, fontWeight: '800', color: Colors.text },
  deptNext: { fontSize: 8, fontWeight: '800', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },
});
