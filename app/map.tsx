import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Radius } from '../src/theme';
import GlassCard from '../src/components/GlassCard';

const VENUES = [
  { name: 'Stade LSS', icon: '🏟️', type: 'Stade', capacity: '60 000', sport: 'Football · Athlétisme' },
  { name: 'Dakar Arena', icon: '🏀', type: 'Arène', capacity: '15 000', sport: 'Basketball · Handball' },
  { name: 'Piscine Olympique', icon: '🏊', type: 'Piscine', capacity: '5 000', sport: 'Natation' },
  { name: 'Palais des Sports', icon: '🥋', type: 'Palais', capacity: '8 000', sport: 'Judo · Lutte' },
  { name: 'Village JOJ', icon: '🏘️', type: 'Village', capacity: '—', sport: 'Athlètes & Délégations' },
  { name: 'Centre Médias', icon: '📡', type: 'Media', capacity: '—', sport: 'Presse & Accrédités' },
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <LinearGradient colors={['#050A18', '#0A2E18', '#050A18']} style={{ flex: 1 }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </Pressable>
          <Text style={[Typography.title2, { fontWeight: '800' }]}>Carte des Venues</Text>
        </View>
      </View>

      {/* Map placeholder */}
      <GlassCard style={styles.mapCard} variant="strong">
        <LinearGradient
          colors={['rgba(78,205,196,0.15)', 'rgba(61,142,245,0.08)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ alignItems: 'center', justifyContent: 'center', height: 220, gap: 12 }}>
          <Ionicons name="map-outline" size={56} color={Colors.teal} />
          <Text style={[Typography.title3, { fontWeight: '700' }]}>Carte Interactive</Text>
          <Text style={[Typography.footnote, { color: Colors.textSecondary, textAlign: 'center' }]}>
            Navigation GPS et wayfinding{'\n'}disponibles lors de l'événement
          </Text>
        </View>
      </GlassCard>

      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Text style={[Typography.label, { color: Colors.textTertiary, marginVertical: 12 }]}>SITES OFFICIELS</Text>
        {VENUES.map((v) => (
          <GlassCard key={v.name} style={{ marginBottom: 10 }} onPress={() => {}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
              <Text style={{ fontSize: 28 }}>{v.icon}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[Typography.callout, { fontWeight: '700' }]}>{v.name}</Text>
                <Text style={[Typography.caption, { color: Colors.textTertiary }]}>{v.sport}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={[Typography.caption, { color: Colors.textSecondary, fontWeight: '600' }]}>{v.type}</Text>
                {v.capacity !== '—' && <Text style={[Typography.caption, { color: Colors.textTertiary }]}>{v.capacity} pl.</Text>}
              </View>
            </View>
          </GlassCard>
        ))}
      </View>
    </LinearGradient>
  );
}

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  mapCard: { marginHorizontal: 20, marginBottom: 4, overflow: 'hidden' },
});
