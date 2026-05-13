import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { useTranslation } from '../src/i18n';
import { getColors, Radius } from '../src/theme';

const { height } = Dimensions.get('window');

const VENUES = [
  {
    id: 1,
    name: 'Stade Léopold Sédar Senghor',
    lat: 14.6937,
    lng: -17.4441,
    capacity: 60000,
    type: 'Stade',
    description: "Stade principal des JOJ 2026. Cérémonie d'ouverture et athlétisme.",
    color: '#FF6B35',
    icon: 'football-outline' as const,
  },
  {
    id: 2,
    name: 'Dakar Arena',
    lat: 14.7167,
    lng: -17.4608,
    capacity: 15000,
    type: 'Salle',
    description: 'Basketball, volleyball, handball.',
    color: '#4A90E2',
    icon: 'basketball-outline' as const,
  },
  {
    id: 3,
    name: 'Piscine Olympique',
    lat: 14.7023,
    lng: -17.4680,
    capacity: 5000,
    type: 'Piscine',
    description: 'Compétitions de natation et plongeon.',
    color: '#3FBDB6',
    icon: 'water-outline' as const,
  },
  {
    id: 4,
    name: 'Palais des Sports',
    lat: 14.6891,
    lng: -17.4523,
    capacity: 8000,
    type: 'Salle',
    description: 'Judo, lutte, boxe, karaté.',
    color: '#7B5EA7',
    icon: 'body-outline' as const,
  },
  {
    id: 5,
    name: 'Stade Iba Mar Diop',
    lat: 14.6808,
    lng: -17.4571,
    capacity: 10000,
    type: 'Stade',
    description: 'Football, athlétisme.',
    color: '#D4AF37',
    icon: 'walk-outline' as const,
  },
  {
    id: 6,
    name: 'Village JOJ',
    lat: 14.7300,
    lng: -17.4500,
    capacity: 3000,
    type: 'Village',
    description: 'Hébergement des athlètes et délégations.',
    color: '#3FBA7A',
    icon: 'home-outline' as const,
  },
  {
    id: 7,
    name: 'Centre des Médias',
    lat: 14.7150,
    lng: -17.4380,
    capacity: 2000,
    type: 'Centre',
    description: 'Accréditation presse et médias.',
    color: '#D866A0',
    icon: 'newspaper-outline' as const,
  },
];

type Venue = (typeof VENUES)[0];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state } = useApp();
  const t = useTranslation(state.language);
  const C = getColors(state.theme);

  const [search, setSearch] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const mapRef = useRef<MapView>(null);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  const filteredVenues = search.trim()
    ? VENUES.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()) || v.type.toLowerCase().includes(search.toLowerCase()))
    : VENUES;

  const openVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    mapRef.current?.animateToRegion(
      { latitude: venue.lat, longitude: venue.lng, latitudeDelta: 0.03, longitudeDelta: 0.03 },
      500
    );
    Animated.spring(sheetAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }).start();
  };

  const closeVenue = () => {
    Animated.timing(sheetAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setSelectedVenue(null));
  };

  const sheetTranslate = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] });

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: C.bg }]}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 14.6937,
          longitude: -17.4441,
          latitudeDelta: 0.12,
          longitudeDelta: 0.12,
        }}
        mapType="standard"
      >
        {filteredVenues.map((venue) => (
          <Marker
            key={venue.id}
            coordinate={{ latitude: venue.lat, longitude: venue.lng }}
            onPress={() => openVenue(venue)}
          >
            <View style={[styles.markerOuter, { borderColor: venue.color + '80', backgroundColor: venue.color + '20' }]}>
              <View style={[styles.markerInner, { backgroundColor: venue.color }]}>
                <Ionicons name={venue.icon} size={14} color="#fff" />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header overlay */}
      <View style={[styles.headerOverlay, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.floatBtn, { backgroundColor: C.bgElevated + 'F0', borderColor: C.border1 }]}
          >
            <Ionicons name="arrow-back-outline" size={20} color={C.text} />
          </Pressable>
          <View style={[styles.searchBar, { backgroundColor: C.bgElevated + 'F0', borderColor: C.border1 }]}>
            <Ionicons name="search-outline" size={16} color={C.textTertiary} />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: C.text }}
              placeholder={t.searchVenue}
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

        {/* Search results */}
        {search.trim().length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, gap: 8 }}
          >
            {filteredVenues.map((v) => (
              <Pressable
                key={v.id}
                onPress={() => { openVenue(v); setSearch(''); }}
                style={[styles.searchChip, { backgroundColor: v.color, borderColor: v.color }]}
              >
                <Ionicons name={v.icon} size={12} color="#fff" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>{v.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Legend pills */}
      <View style={[styles.legendRow, { bottom: insets.bottom + (selectedVenue ? 280 : 24) }]}>
        {[
          { type: 'Stade', color: '#FF6B35' },
          { type: 'Salle', color: '#4A90E2' },
          { type: 'Village', color: '#3FBA7A' },
          { type: 'Centre', color: '#D866A0' },
        ].map((l) => (
          <View key={l.type} style={[styles.legendPill, { backgroundColor: C.bgElevated + 'E8', borderColor: C.border1 }]}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: l.color }} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.textSecondary }}>{l.type}</Text>
          </View>
        ))}
      </View>

      {/* Bottom sheet */}
      {selectedVenue && (
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: C.bgElevated,
              borderColor: C.border1,
              paddingBottom: insets.bottom + 16,
              transform: [{ translateY: sheetTranslate }],
            },
          ]}
        >
          <View style={[styles.sheetHandle, { backgroundColor: C.border2 }]} />
          <View style={styles.sheetHeader}>
            <View style={[styles.sheetIconBox, { backgroundColor: selectedVenue.color + '20', borderColor: selectedVenue.color + '30' }]}>
              <Ionicons name={selectedVenue.icon} size={24} color={selectedVenue.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sheetName, { color: C.text }]}>{selectedVenue.name}</Text>
              <View style={[styles.sheetTypeBadge, { backgroundColor: selectedVenue.color + '20', borderColor: selectedVenue.color + '30' }]}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: selectedVenue.color, letterSpacing: 0.5 }}>{selectedVenue.type.toUpperCase()}</Text>
              </View>
            </View>
            <Pressable onPress={closeVenue} style={[styles.closeBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
              <Ionicons name="close-outline" size={18} color={C.text} />
            </Pressable>
          </View>

          <Text style={[styles.sheetDesc, { color: C.textSecondary }]}>{selectedVenue.description}</Text>

          <View style={styles.sheetMeta}>
            <View style={[styles.sheetMetaItem, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
              <Ionicons name="people-outline" size={16} color={C.textTertiary} />
              <Text style={{ fontSize: 13, color: C.textSecondary }}>{t.capacity}</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: C.text }}>{selectedVenue.capacity.toLocaleString('fr-FR')}</Text>
            </View>
            <View style={[styles.sheetMetaItem, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
              <Ionicons name="radio-button-on-outline" size={16} color={C.success} />
              <Text style={{ fontSize: 13, color: C.textSecondary }}>{t.openNow}</Text>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.success }} />
            </View>
          </View>

          <Pressable
            onPress={() => { closeVenue(); router.push('/(tabs)/transport' as any); }}
            style={[styles.sheetBtn, { overflow: 'hidden' }]}
          >
            <LinearGradientWrapper color={selectedVenue.color} />
            <Ionicons name="navigate-outline" size={18} color="#fff" />
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Itinéraire Yango</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

function LinearGradientWrapper({ color }: { color: string }) {
  const { LinearGradient } = require('expo-linear-gradient');
  return (
    <LinearGradient
      colors={[color, color + 'BB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}

const styles = StyleSheet.create({
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  floatBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1,
  },
  searchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  legendRow: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  markerOuter: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  markerInner: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 20,
    paddingTop: 12,
    gap: 14,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sheetIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sheetName: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sheetTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  sheetDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  sheetMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  sheetMetaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  sheetBtn: {
    height: 52,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
