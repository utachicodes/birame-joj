import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Radius } from '../src/theme';

const VENUES: Array<{
  name: string;
  type: string;
  capacity: string;
  sport: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { name: 'Stade Léopold Sédar Senghor', type: 'Stade', capacity: '60 000 places', sport: 'Football · Athlétisme · Cérémonies', icon: 'football-outline' },
  { name: 'Dakar Arena', type: 'Arène', capacity: '15 000 places', sport: 'Basketball · Handball', icon: 'basketball-outline' },
  { name: 'Piscine Olympique', type: 'Piscine', capacity: '5 000 places', sport: 'Natation', icon: 'water-outline' },
  { name: 'Palais des Sports', type: 'Palais', capacity: '8 000 places', sport: 'Judo · Lutte · Taekwondo', icon: 'body-outline' },
  { name: 'Stade Iba Mar Diop', type: 'Stade', capacity: '12 000 places', sport: 'Athlétisme', icon: 'walk-outline' },
  { name: 'Village JOJ', type: 'Village', capacity: 'Résidentiel', sport: 'Athlètes & Délégations', icon: 'home-outline' },
  { name: 'Centre Médias', type: 'Media', capacity: 'Accrédités', sport: 'Presse & Journalistes', icon: 'newspaper-outline' },
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bg]} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Carte des venues</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="search-outline" size={20} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapHero}>
          <LinearGradient colors={[Colors.teal + '30', Colors.blue + '15']} style={StyleSheet.absoluteFill} />
          <View style={styles.mapHeroContent}>
            <View style={styles.mapHeroIcon}>
              <Ionicons name="map" size={40} color={Colors.teal} />
            </View>
            <Text style={styles.mapHeroTitle}>Carte interactive</Text>
            <Text style={styles.mapHeroSub}>Navigation GPS et wayfinding{'\n'}disponibles pendant l'événement</Text>
            <Pressable style={styles.mapHeroBtn}>
              <Ionicons name="navigate" size={14} color="#fff" />
              <Text style={styles.mapHeroBtnText}>Activer la navigation</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Venues</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>11</Text>
            <Text style={styles.statLabel}>Disciplines</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>120K</Text>
            <Text style={styles.statLabel}>Places</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>SITES OFFICIELS</Text>

        {VENUES.map((v) => (
          <Pressable key={v.name} style={styles.venue}>
            <View style={styles.venueIconWrap}>
              <Ionicons name={v.icon} size={22} color={Colors.brand} />
            </View>
            <View style={styles.venueInfo}>
              <View style={styles.venueTopRow}>
                <Text style={styles.venueName}>{v.name}</Text>
                <View style={styles.venueTypeBadge}>
                  <Text style={styles.venueTypeText}>{v.type}</Text>
                </View>
              </View>
              <Text style={styles.venueSport}>{v.sport}</Text>
              <View style={styles.venueMeta}>
                <Ionicons name="people-outline" size={11} color={Colors.textTertiary} />
                <Text style={styles.venueCapacity}>{v.capacity}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border1 },
  iconBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...Typography.title2, fontWeight: '800', flex: 1, marginLeft: 4 },
  scroll: { padding: 20, gap: 14 },

  mapHero: { borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1 },
  mapHeroContent: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  mapHeroIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: Colors.surface3, borderWidth: 1, borderColor: Colors.teal + '40', alignItems: 'center', justifyContent: 'center' },
  mapHeroTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginTop: 4 },
  mapHeroSub: { ...Typography.footnote, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  mapHeroBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 11, borderRadius: Radius.full, backgroundColor: Colors.teal, marginTop: 8 },
  mapHeroBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  statRow: { flexDirection: 'row', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 16 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: StyleSheet.hairlineWidth, backgroundColor: Colors.border1 },
  statValue: { fontSize: 22, fontWeight: '900', color: Colors.text },
  statLabel: { ...Typography.caption, color: Colors.textTertiary, fontWeight: '600' },

  sectionLabel: { ...Typography.label, marginTop: 4, marginBottom: 4 },

  venue: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 14, gap: 12, marginBottom: 8 },
  venueIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.brand + '15', borderWidth: 1, borderColor: Colors.brand + '25', alignItems: 'center', justifyContent: 'center' },
  venueInfo: { flex: 1, gap: 4 },
  venueTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  venueName: { ...Typography.callout, fontWeight: '700', flex: 1 },
  venueTypeBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full, backgroundColor: Colors.surface3, borderWidth: 1, borderColor: Colors.border1 },
  venueTypeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5, color: Colors.textSecondary },
  venueSport: { ...Typography.caption, color: Colors.textTertiary },
  venueMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  venueCapacity: { fontSize: 11, color: Colors.textTertiary, fontWeight: '500' },
});
