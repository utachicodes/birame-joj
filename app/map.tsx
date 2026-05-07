import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Radius } from '../src/theme';
import GlassCard from '../src/components/GlassCard';

const VENUES = [
  { name: 'Stade LSS', type: 'Stade', capacity: '60 000', sport: 'Football · Athlétisme', color: Colors.orange },
  { name: 'Dakar Arena', type: 'Arène', capacity: '15 000', sport: 'Basketball · Handball', color: Colors.teal },
  { name: 'Piscine Olympique', type: 'Piscine', capacity: '5 000', sport: 'Natation', color: Colors.blue },
  { name: 'Palais des Sports', type: 'Palais', capacity: '8 000', sport: 'Judo · Lutte', color: Colors.purple },
  { name: 'Village JOJ', type: 'Village', capacity: 'Résidentiel', sport: 'Athlètes & Délégations', color: Colors.gold },
  { name: 'Centre Médias', type: 'Media', capacity: 'Accrédités', sport: 'Presse & Journalistes', color: Colors.pink },
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <LinearGradient colors={['#050A18', '#0A1A2E', '#050A18']} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Carte des Venues</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.mapCard} variant="strong">
          <LinearGradient
            colors={['rgba(78,205,196,0.15)', 'rgba(61,142,245,0.08)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapIconRing}>
              <Ionicons name="map-outline" size={44} color={Colors.teal} />
            </View>
            <Text style={styles.mapTitle}>Carte Interactive</Text>
            <Text style={styles.mapSub}>Navigation GPS et wayfinding disponibles lors de l'événement</Text>
          </View>
        </GlassCard>

        <Text style={styles.sectionLabel}>SITES OFFICIELS</Text>

        {VENUES.map((v) => (
          <GlassCard key={v.name} style={styles.venueCard} onPress={() => {}}>
            <View style={[styles.venueAccent, { backgroundColor: v.color }]} />
            <View style={styles.venueContent}>
              <View style={[styles.venueIconWrap, { backgroundColor: v.color + '20' }]}>
                <Ionicons name="location-outline" size={20} color={v.color} />
              </View>
              <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{v.name}</Text>
                <Text style={styles.venueSport}>{v.sport}</Text>
              </View>
              <View style={styles.venueMeta}>
                <Text style={styles.venueType}>{v.type}</Text>
                <Text style={styles.venueCapacity}>{v.capacity}</Text>
              </View>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  title: { ...Typography.title2, fontWeight: '800' },
  scroll: { paddingHorizontal: 20, gap: 10 },
  mapCard: { overflow: 'hidden', marginBottom: 4 },
  mapPlaceholder: { height: 200, alignItems: 'center', justifyContent: 'center', gap: 12 },
  mapIconRing: { width: 72, height: 72, borderRadius: 22, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.teal + '40', alignItems: 'center', justifyContent: 'center' },
  mapTitle: { ...Typography.title3, fontWeight: '700' },
  mapSub: { ...Typography.footnote, color: Colors.textSecondary, textAlign: 'center', maxWidth: 260 },
  sectionLabel: { ...Typography.label, color: Colors.textTertiary },
  venueCard: { overflow: 'hidden' },
  venueAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  venueContent: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingLeft: 18, gap: 12 },
  venueIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  venueInfo: { flex: 1, gap: 3 },
  venueName: { ...Typography.callout, fontWeight: '700' },
  venueSport: { ...Typography.caption, color: Colors.textTertiary },
  venueMeta: { alignItems: 'flex-end', gap: 3 },
  venueType: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  venueCapacity: { ...Typography.caption, color: Colors.textTertiary },
});
