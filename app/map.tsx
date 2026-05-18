import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { getColors, Radius } from '../src/theme';

const { width, height } = Dimensions.get('window');

const VENUES = [
  {
    id: 1,
    name: 'Stade Léopold Sédar Senghor',
    shortName: 'Stade LSS',
    lat: 14.6937,
    lng: -17.4441,
    capacity: 60000,
    type: 'Stade',
    description: "Stade principal des JOJ 2026. Cérémonie d'ouverture et athlétisme.",
    color: '#FF6B35',
    icon: 'football-outline' as const,
    // normalised 0–1 position on our pseudo-map canvas
    x: 0.52,
    y: 0.68,
  },
  {
    id: 2,
    name: 'Dakar Arena',
    shortName: 'Dakar Arena',
    lat: 14.7167,
    lng: -17.4608,
    capacity: 15000,
    type: 'Salle',
    description: 'Basketball, volleyball, handball.',
    color: '#4A90E2',
    icon: 'basketball-outline' as const,
    x: 0.30,
    y: 0.28,
  },
  {
    id: 3,
    name: 'Piscine Olympique',
    shortName: 'Piscine',
    lat: 14.7023,
    lng: -17.4680,
    capacity: 5000,
    type: 'Piscine',
    description: 'Compétitions de natation et plongeon.',
    color: '#3FBDB6',
    icon: 'water-outline' as const,
    x: 0.20,
    y: 0.50,
  },
  {
    id: 4,
    name: 'Palais des Sports',
    shortName: 'Palais Sports',
    lat: 14.6891,
    lng: -17.4523,
    capacity: 8000,
    type: 'Salle',
    description: 'Judo, lutte, boxe, karaté.',
    color: '#7B5EA7',
    icon: 'body-outline' as const,
    x: 0.44,
    y: 0.80,
  },
  {
    id: 5,
    name: 'Stade Iba Mar Diop',
    shortName: 'Stade IMD',
    lat: 14.6808,
    lng: -17.4571,
    capacity: 10000,
    type: 'Stade',
    description: 'Football, athlétisme.',
    color: '#D4AF37',
    icon: 'walk-outline' as const,
    x: 0.38,
    y: 0.88,
  },
  {
    id: 6,
    name: 'Village JOJ',
    shortName: 'Village JOJ',
    lat: 14.7300,
    lng: -17.4500,
    capacity: 3000,
    type: 'Village',
    description: 'Hébergement des athlètes et délégations.',
    color: '#3FBA7A',
    icon: 'home-outline' as const,
    x: 0.48,
    y: 0.14,
  },
  {
    id: 7,
    name: 'Centre des Médias',
    shortName: 'Médias',
    lat: 14.7150,
    lng: -17.4380,
    capacity: 2000,
    type: 'Centre',
    description: 'Accréditation presse et médias.',
    color: '#D866A0',
    icon: 'newspaper-outline' as const,
    x: 0.68,
    y: 0.32,
  },
];

type Venue = (typeof VENUES)[0];

const MAP_H = height * 0.42;
const MARKER_SIZE = 38;

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state } = useApp();
  const C = getColors(state.theme);

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Venue | null>(null);

  const filtered = search.trim()
    ? VENUES.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.type.toLowerCase().includes(search.toLowerCase()),
      )
    : VENUES;

  return (
    <View style={[s.root, { backgroundColor: C.bg }]}>
      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + 8, borderBottomColor: C.border1, backgroundColor: C.bg }]}>
        <View style={s.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={[s.iconBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]}
          >
            <Ionicons name="arrow-back-outline" size={20} color={C.text} />
          </Pressable>
          <Text style={[s.headerTitle, { color: C.text }]}>Carte des sites</Text>
          <View style={[s.iconBtn, { backgroundColor: 'transparent', borderColor: 'transparent' }]} />
        </View>

        {/* Search bar */}
        <View style={[s.searchBar, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
          <Ionicons name="search-outline" size={16} color={C.textTertiary} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: C.text }}
            placeholder="Rechercher un site..."
            placeholderTextColor={C.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-outline" size={16} color={C.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Pseudo-map canvas ── */}
        <View style={[s.mapCanvas, { height: MAP_H }]}>
          <LinearGradient
            colors={state.theme === 'dark' ? ['#0C1628', '#0E1F3A', '#091220'] : ['#C8D8E8', '#D8E8F0', '#C0D0E0']}
            style={StyleSheet.absoluteFill}
          />

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((r) => (
            <View
              key={`h${r}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: MAP_H * r,
                height: StyleSheet.hairlineWidth,
                backgroundColor: state.theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              }}
            />
          ))}
          {[0.25, 0.5, 0.75].map((r) => (
            <View
              key={`v${r}`}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: width * r,
                width: StyleSheet.hairlineWidth,
                backgroundColor: state.theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              }}
            />
          ))}

          {/* Road-like curves (decorative) */}
          <View style={[s.road, { top: MAP_H * 0.5, left: 0, right: 0, opacity: 0.18, height: 3, backgroundColor: state.theme === 'dark' ? '#fff' : '#444' }]} />
          <View style={[s.road, { top: 0, bottom: 0, left: width * 0.5, opacity: 0.18, width: 3, backgroundColor: state.theme === 'dark' ? '#fff' : '#444' }]} />

          {/* "DAKAR" watermark */}
          <Text style={[s.watermark, { color: state.theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }]}>
            DAKAR
          </Text>

          {/* Venue markers */}
          {filtered.map((venue) => {
            const isSelected = selected?.id === venue.id;
            const left = venue.x * width - MARKER_SIZE / 2;
            const top  = venue.y * MAP_H - MARKER_SIZE / 2;
            return (
              <Pressable
                key={venue.id}
                onPress={() => setSelected(isSelected ? null : venue)}
                style={[
                  s.marker,
                  {
                    left,
                    top,
                    borderColor: isSelected ? venue.color : venue.color + '80',
                    backgroundColor: isSelected ? venue.color + '30' : venue.color + '18',
                    transform: [{ scale: isSelected ? 1.18 : 1 }],
                  },
                ]}
              >
                <View style={[s.markerInner, { backgroundColor: venue.color }]}>
                  <Ionicons name={venue.icon} size={14} color="#fff" />
                </View>
                {isSelected && (
                  <View style={[s.markerLabel, { backgroundColor: venue.color }]}>
                    <Text style={s.markerLabelText}>{venue.shortName}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}

          {/* Compass rose */}
          <View style={[s.compass, { backgroundColor: C.bgElevated + 'CC', borderColor: C.border1 }]}>
            <Ionicons name="compass-outline" size={18} color={C.textSecondary} />
          </View>
        </View>

        {/* Legend */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
        >
          {[
            { type: 'Stade',   color: '#FF6B35' },
            { type: 'Salle',   color: '#4A90E2' },
            { type: 'Village', color: '#3FBA7A' },
            { type: 'Piscine', color: '#3FBDB6' },
            { type: 'Centre',  color: '#D866A0' },
          ].map((l) => (
            <Pressable
              key={l.type}
              onPress={() => setSearch(search === l.type ? '' : l.type)}
              style={[
                s.legendPill,
                {
                  backgroundColor: search === l.type ? l.color + '25' : C.surface2,
                  borderColor: search === l.type ? l.color + '60' : C.border1,
                },
              ]}
            >
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: l.color }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.textSecondary }}>{l.type}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Selected venue detail card */}
        {selected && (
          <View style={[s.detailCard, { backgroundColor: C.surface2, borderColor: selected.color + '40' }]}>
            <View style={s.detailHeader}>
              <View style={[s.detailIcon, { backgroundColor: selected.color + '20', borderColor: selected.color + '30' }]}>
                <Ionicons name={selected.icon} size={22} color={selected.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.detailName, { color: C.text }]}>{selected.name}</Text>
                <View style={[s.typeBadge, { backgroundColor: selected.color + '20', borderColor: selected.color + '30' }]}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: selected.color, letterSpacing: 0.5 }}>
                    {selected.type.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => setSelected(null)} style={[s.closeBtn, { backgroundColor: C.surface3, borderColor: C.border2 }]}>
                <Ionicons name="close-outline" size={18} color={C.text} />
              </Pressable>
            </View>

            <Text style={[s.detailDesc, { color: C.textSecondary }]}>{selected.description}</Text>

            <View style={s.detailMeta}>
              <View style={[s.metaItem, { backgroundColor: C.bg, borderColor: C.border1 }]}>
                <Ionicons name="people-outline" size={15} color={C.textTertiary} />
                <Text style={{ fontSize: 12, color: C.textSecondary }}>Capacité</Text>
                <Text style={{ fontSize: 14, fontWeight: '800', color: C.text }}>
                  {selected.capacity.toLocaleString('fr-FR')}
                </Text>
              </View>
              <View style={[s.metaItem, { backgroundColor: C.bg, borderColor: C.border1 }]}>
                <Ionicons name="radio-button-on-outline" size={15} color={C.success} />
                <Text style={{ fontSize: 12, color: C.textSecondary }}>Statut</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.success }} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.success }}>Ouvert</Text>
                </View>
              </View>
            </View>

            <Pressable
              style={[s.navBtn, { overflow: 'hidden' }]}
              onPress={() => { setSelected(null); router.push('/(tabs)/transport' as any); }}
            >
              <LinearGradient
                colors={[selected.color, selected.color + 'BB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="navigate-outline" size={18} color="#fff" />
              <Text style={s.navBtnText}>Itinéraire Yango</Text>
            </Pressable>
          </View>
        )}

        {/* Venues list */}
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          <Text style={[s.sectionLabel, { color: C.textTertiary }]}>
            {filtered.length} SITE{filtered.length !== 1 ? 'S' : ''}
          </Text>
          {filtered.map((venue) => (
            <Pressable
              key={venue.id}
              onPress={() => setSelected(selected?.id === venue.id ? null : venue)}
              style={[
                s.listRow,
                {
                  backgroundColor: selected?.id === venue.id ? venue.color + '12' : C.surface2,
                  borderColor: selected?.id === venue.id ? venue.color + '50' : C.border1,
                },
              ]}
            >
              <View style={[s.listIcon, { backgroundColor: venue.color + '20', borderColor: venue.color + '30' }]}>
                <Ionicons name={venue.icon} size={18} color={venue.color} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{venue.name}</Text>
                <Text style={{ fontSize: 12, color: C.textTertiary }}>{venue.type}  ·  {venue.capacity.toLocaleString('fr-FR')} places</Text>
              </View>
              <Ionicons
                name={selected?.id === venue.id ? 'chevron-down' : 'chevron-forward'}
                size={16}
                color={C.textTertiary}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1,
  },
  mapCanvas: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  road: { position: 'absolute' },
  watermark: {
    position: 'absolute',
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: 12,
    alignSelf: 'center',
    top: '30%',
  },
  marker: {
    position: 'absolute',
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  markerInner: {
    width: 26,
    height: 26,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabel: {
    position: 'absolute',
    top: MARKER_SIZE + 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 10,
  },
  markerLabelText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  compass: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  detailCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  detailName: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  detailDesc: { fontSize: 13, lineHeight: 19 },
  detailMeta: { flexDirection: 'row', gap: 10 },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  navBtn: {
    height: 50,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
