import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Colors, Typography, Radius, Shadows } from '../theme';
import { TRANSPORT } from '../data/mock';

const { width } = Dimensions.get('window');

type TransportTab = 'overview' | 'yango' | 'navettes';

export default function TransportScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TransportTab>('overview');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#050A18', '#0A0D2E', '#050A18']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,10,24,0.5)' }]} />
        <Text style={styles.headerTitle}>Transport</Text>
        <View style={styles.tabsRow}>
          {(['overview', 'yango', 'navettes'] as TransportTab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabPill, t === tab && styles.tabPillActive]}
            >
              <Text style={[styles.tabPillText, t === tab && styles.tabPillTextActive]}>
                {t === 'overview' ? '🗺️ Vue' : t === 'yango' ? '🚗 Yango' : '🚌 Navettes'}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.headerBorder} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'overview' && <OverviewTab />}
        {tab === 'yango' && <YangoTab />}
        {tab === 'navettes' && <NavettesTab />}
      </ScrollView>
    </View>
  );
}

function OverviewTab() {
  return (
    <>
      {/* Map placeholder */}
      <GlassCard style={styles.mapCard} variant="strong">
        <LinearGradient
          colors={['rgba(61,142,245,0.2)', 'rgba(78,205,196,0.1)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.mapContent}>
          <Ionicons name="map-outline" size={48} color={Colors.textTertiary} />
          <Text style={styles.mapTitle}>Carte des transports</Text>
          <Text style={styles.mapSub}>Venues · Navettes · Itinéraires</Text>
          <GlassButton
            title="Ouvrir la carte"
            onPress={() => {}}
            size="md"
            gradient={[Colors.blue, Colors.blueLight]}
            icon={<Ionicons name="navigate-outline" size={16} color="#fff" />}
          />
        </View>
      </GlassCard>

      {/* Status pills */}
      <View style={styles.statusRow}>
        <StatusPill icon="bus-outline" label="Navettes" status="EN SERVICE" color={Colors.success} />
        <StatusPill icon="car-outline" label="Yango" status="DISPONIBLE" color={Colors.teal} />
        <StatusPill icon="airplane-outline" label="AIBD" status="NORMAL" color={Colors.blue} />
      </View>

      <Text style={styles.sectionLabel}>OPTIONS DE TRANSPORT</Text>
      {TRANSPORT.map((t) => (
        <TransportCard key={t.id} transport={t} />
      ))}

      {/* Emergency */}
      <GlassCard style={styles.emergCard}>
        <LinearGradient
          colors={['rgba(255,82,112,0.2)', 'rgba(255,82,112,0.05)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.emergContent}>
          <Ionicons name="alert-circle-outline" size={28} color={Colors.error} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.emergTitle}>Transport d'urgence</Text>
            <Text style={styles.emergSub}>Médical, sécurité, évacuation</Text>
          </View>
          <GlassButton title="Appeler" onPress={() => {}} size="sm" variant="danger" />
        </View>
      </GlassCard>
    </>
  );
}

function YangoTab() {
  const [destination, setDestination] = useState('');

  return (
    <>
      {/* Yango hero */}
      <GlassCard style={styles.yangoHero} variant="strong">
        <LinearGradient
          colors={['rgba(255,107,53,0.3)', 'rgba(255,107,53,0.08)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.yangoLogoRow}>
          <Text style={styles.yangoLogo}>🚗</Text>
          <View>
            <Text style={styles.yangoTitle}>Yango Ride</Text>
            <Text style={styles.yangoSub}>Partenaire officiel JOJ</Text>
          </View>
          <View style={styles.yangoBadge}>
            <Text style={styles.yangoBadgeText}>ACTIF</Text>
          </View>
        </View>
      </GlassCard>

      {/* Route input */}
      <GlassCard style={styles.routeCard} variant="strong">
        <View style={styles.routeRow}>
          <View style={styles.routeDots}>
            <View style={styles.routeDotTop} />
            <View style={styles.routeLine} />
            <View style={styles.routeDotBot} />
          </View>
          <View style={styles.routeInputs}>
            <Pressable style={styles.routeInput}>
              <Text style={styles.routeInputLabel}>De</Text>
              <Text style={styles.routeInputValue}>Ma position actuelle 📍</Text>
            </Pressable>
            <View style={styles.routeDivider} />
            <Pressable style={styles.routeInput}>
              <Text style={styles.routeInputLabel}>À</Text>
              <Text style={[styles.routeInputValue, { color: Colors.textTertiary }]}>
                Choisir destination...
              </Text>
            </Pressable>
          </View>
        </View>
      </GlassCard>

      {/* Venue shortcuts */}
      <Text style={styles.sectionLabel}>DESTINATIONS RAPIDES</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.venueList}
      >
        {VENUES.map((v) => (
          <Pressable key={v.name} style={styles.venueChip}>
            <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.glass2, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border1 }]} />
            <Text style={styles.venueIcon}>{v.icon}</Text>
            <Text style={styles.venueName}>{v.name}</Text>
            <Text style={styles.venueDist}>{v.dist}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Ride estimate */}
      <GlassCard style={styles.estimateCard} variant="strong">
        <View style={styles.estimateRow}>
          <View style={styles.estimateItem}>
            <Text style={styles.estimateValue}>8 min</Text>
            <Text style={styles.estimateLabel}>Attente estimée</Text>
          </View>
          <View style={styles.estimateDivider} />
          <View style={styles.estimateItem}>
            <Text style={styles.estimateValue}>2 500 XOF</Text>
            <Text style={styles.estimateLabel}>Tarif estimé</Text>
          </View>
          <View style={styles.estimateDivider} />
          <View style={styles.estimateItem}>
            <Text style={styles.estimateValue}>3 🌟</Text>
            <Text style={styles.estimateLabel}>Chauffeurs dispo.</Text>
          </View>
        </View>
        <GlassButton
          title="Réserver un Yango"
          onPress={() => {}}
          fullWidth
          size="lg"
          gradient={[Colors.orange, Colors.orangeLight]}
          icon={<Ionicons name="car-outline" size={18} color="#fff" />}
        />
      </GlassCard>
    </>
  );
}

function NavettesTab() {
  return (
    <>
      <GlassCard style={styles.navInfo} variant="strong">
        <LinearGradient
          colors={['rgba(78,205,196,0.2)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.navInfoTitle}>🚌 Navettes officielles JOJ</Text>
        <Text style={styles.navInfoSub}>
          Service gratuit pour tous les accrédités. Fréquence renforcée lors des finales.
        </Text>
      </GlassCard>

      {SHUTTLE_ROUTES.map((route) => (
        <ShuttleCard key={route.id} route={route} />
      ))}
    </>
  );
}

function TransportCard({ transport }: { transport: (typeof TRANSPORT)[0] }) {
  return (
    <GlassCard style={styles.transportCard} onPress={() => {}}>
      <View style={[styles.transportIcon, { backgroundColor: transport.color + '20' }]}>
        <Ionicons name={transport.icon as any} size={24} color={transport.color} />
      </View>
      <View style={styles.transportInfo}>
        <Text style={styles.transportName}>{transport.name}</Text>
        <View style={styles.transportRoute}>
          <Text style={styles.transportFrom}>{transport.from}</Text>
          <Ionicons name="arrow-forward" size={12} color={Colors.textTertiary} />
          <Text style={styles.transportTo}>{transport.to}</Text>
        </View>
        <Text style={styles.transportDetail}>
          {transport.type === 'yango'
            ? `${transport.estimate} · ${transport.price}`
            : `Prochain: ${transport.nextDeparture} · ${transport.duration}`}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
    </GlassCard>
  );
}

function StatusPill({ icon, label, status, color }: { icon: any; label: string; status: string; color: string }) {
  return (
    <View style={styles.statusPill}>
      <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: color + '10', borderRadius: Radius.md, borderWidth: 1, borderColor: color + '30' }]} />
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.statusPillLabel}>{label}</Text>
      <Text style={[styles.statusPillStatus, { color }]}>{status}</Text>
    </View>
  );
}

function ShuttleCard({ route }: { route: (typeof SHUTTLE_ROUTES)[0] }) {
  return (
    <GlassCard style={styles.shuttleCard} variant="strong">
      <View style={styles.shuttleHeader}>
        <View style={[styles.shuttleIconWrap, { backgroundColor: route.color + '20' }]}>
          <Ionicons name="bus-outline" size={22} color={route.color} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.shuttleName}>{route.name}</Text>
          <Text style={styles.shuttleRoute}>{route.from} → {route.to}</Text>
        </View>
        <View style={[styles.availBadge, { backgroundColor: route.available > 10 ? Colors.success + '20' : Colors.warning + '20', borderColor: route.available > 10 ? Colors.success + '40' : Colors.warning + '40' }]}>
          <Text style={[styles.availText, { color: route.available > 10 ? Colors.success : Colors.warning }]}>
            {route.available} places
          </Text>
        </View>
      </View>
      <View style={styles.deptRow}>
        {route.departures.map((d, i) => (
          <Pressable key={i} style={[styles.deptChip, i === 0 && styles.deptChipNext]}>
            {i === 0 && (
              <LinearGradient colors={[route.color, route.color + '80']} style={StyleSheet.absoluteFill} />
            )}
            <Text style={[styles.deptTime, i === 0 && { color: '#fff' }]}>{d}</Text>
            {i === 0 && <Text style={styles.deptNext}>PROCHAIN</Text>}
          </Pressable>
        ))}
      </View>
    </GlassCard>
  );
}

const VENUES = [
  { name: 'Dakar Arena', icon: '🏟️', dist: '4.2 km' },
  { name: 'Stade LSS', icon: '⚽', dist: '7.8 km' },
  { name: 'AIBD', icon: '✈️', dist: '45 km' },
  { name: 'Village JOJ', icon: '🏘️', dist: '2.1 km' },
  { name: 'Média Centre', icon: '📡', dist: '5.5 km' },
];

const SHUTTLE_ROUTES = [
  {
    id: 'S1',
    name: 'Route A — Centre',
    from: 'AIBD',
    to: 'Dakar Centre',
    available: 24,
    color: Colors.teal,
    departures: ['14:35', '15:05', '15:35', '16:05'],
  },
  {
    id: 'S2',
    name: 'Route B — Arènes',
    from: 'Village JOJ',
    to: 'Stade LSS',
    available: 8,
    color: Colors.orange,
    departures: ['15:00', '15:30', '16:00', '16:30'],
  },
  {
    id: 'S3',
    name: 'Route C — Arena',
    from: 'Hôtel Roi du Lac',
    to: 'Dakar Arena',
    available: 18,
    color: Colors.blue,
    departures: ['13:45', '14:15', '14:45'],
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  blob1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: Colors.purple + '08', top: 100, right: -80 },
  blob2: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: Colors.teal + '08', bottom: 200, left: -50 },
  header: { overflow: 'hidden' },
  headerTitle: { ...Typography.title2, fontWeight: '800', paddingHorizontal: 20, paddingBottom: 14 },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  tabPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border1, backgroundColor: Colors.glass1 },
  tabPillActive: { backgroundColor: Colors.glass3, borderColor: Colors.border2 },
  tabPillText: { ...Typography.footnote, color: Colors.textTertiary, fontWeight: '600' },
  tabPillTextActive: { color: Colors.text },
  headerBorder: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1 },
  scroll: { padding: 16, gap: 12 },
  sectionLabel: { ...Typography.label, color: Colors.textTertiary, marginTop: 4 },
  mapCard: { padding: 0, overflow: 'hidden' },
  mapContent: { height: 180, alignItems: 'center', justifyContent: 'center', gap: 12 },
  mapTitle: { ...Typography.title3, fontWeight: '700' },
  mapSub: { ...Typography.footnote, color: Colors.textSecondary },
  statusRow: { flexDirection: 'row', gap: 10 },
  statusPill: { flex: 1, borderRadius: Radius.md, overflow: 'hidden', alignItems: 'center', paddingVertical: 12, gap: 4 },
  statusPillLabel: { ...Typography.caption, fontWeight: '700', color: Colors.textSecondary },
  statusPillStatus: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  transportCard: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  transportIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  transportInfo: { flex: 1, gap: 4 },
  transportName: { ...Typography.callout, fontWeight: '700' },
  transportRoute: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  transportFrom: { ...Typography.caption, color: Colors.textSecondary },
  transportTo: { ...Typography.caption, color: Colors.textSecondary },
  transportDetail: { ...Typography.caption, color: Colors.textTertiary },
  emergCard: { overflow: 'hidden' },
  emergContent: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  emergTitle: { ...Typography.callout, fontWeight: '700' },
  emergSub: { ...Typography.caption, color: Colors.textSecondary },
  yangoHero: { padding: 20, overflow: 'hidden', gap: 4 },
  yangoLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  yangoLogo: { fontSize: 32 },
  yangoTitle: { ...Typography.title3, fontWeight: '800' },
  yangoSub: { ...Typography.footnote, color: Colors.textSecondary },
  yangoBadge: { marginLeft: 'auto', backgroundColor: Colors.success + '25', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.success + '50' },
  yangoBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.success, letterSpacing: 0.5 },
  routeCard: { padding: 0, overflow: 'hidden' },
  routeRow: { flexDirection: 'row', padding: 16, gap: 12 },
  routeDots: { alignItems: 'center', paddingTop: 20, gap: 0 },
  routeDotTop: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.orange, borderWidth: 2, borderColor: Colors.orange + '50' },
  routeLine: { width: 2, flex: 1, backgroundColor: Colors.border2, marginVertical: 4 },
  routeDotBot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.teal, borderWidth: 2, borderColor: Colors.teal + '50' },
  routeInputs: { flex: 1, gap: 0 },
  routeInput: { paddingVertical: 14, gap: 2 },
  routeInputLabel: { ...Typography.caption, color: Colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  routeInputValue: { ...Typography.callout, fontWeight: '600' },
  routeDivider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1 },
  venueList: { gap: 10, paddingBottom: 4 },
  venueChip: { width: 100, height: 90, borderRadius: Radius.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: 6 },
  venueIcon: { fontSize: 24 },
  venueName: { ...Typography.caption, fontWeight: '700', textAlign: 'center' },
  venueDist: { ...Typography.caption, color: Colors.textTertiary, fontSize: 10 },
  estimateCard: { padding: 20, gap: 16, overflow: 'hidden' },
  estimateRow: { flexDirection: 'row', alignItems: 'center' },
  estimateItem: { flex: 1, alignItems: 'center', gap: 4 },
  estimateDivider: { width: StyleSheet.hairlineWidth, height: 40, backgroundColor: Colors.border1 },
  estimateValue: { ...Typography.title3, fontWeight: '800' },
  estimateLabel: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center' },
  navInfo: { padding: 20, gap: 8, overflow: 'hidden' },
  navInfoTitle: { ...Typography.title3, fontWeight: '700' },
  navInfoSub: { ...Typography.callout, color: Colors.textSecondary, lineHeight: 22 },
  shuttleCard: { padding: 20, gap: 16, overflow: 'hidden' },
  shuttleHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shuttleIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  shuttleName: { ...Typography.callout, fontWeight: '700' },
  shuttleRoute: { ...Typography.footnote, color: Colors.textSecondary },
  availBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  availText: { fontSize: 10, fontWeight: '700' },
  deptRow: { flexDirection: 'row', gap: 8 },
  deptChip: { flex: 1, height: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.glass1, borderWidth: 1, borderColor: Colors.border1, overflow: 'hidden', gap: 2 },
  deptChipNext: { borderWidth: 0 },
  deptTime: { ...Typography.callout, fontWeight: '800', color: Colors.text },
  deptNext: { fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 },
});
