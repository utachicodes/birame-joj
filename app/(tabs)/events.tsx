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
import { useApp } from '../../src/context/AppContext';
import { useTranslation } from '../../src/i18n';
import { getColors, Radius } from '../../src/theme';
import CountryBadge from '../../src/components/CountryBadge';
import SportIcon from '../../src/components/SportIcon';
import { EVENTS, LIVE_SCORES, MEDAL_TABLE } from '../../src/data/mock';

type Tab = 'programme' | 'live' | 'medailles';

const DAYS = [
  { day: 'Auj.', date: '28' },
  { day: 'Mer.', date: '29' },
  { day: 'Jeu.', date: '30' },
  { day: 'Ven.', date: '31' },
  { day: 'Sam.', date: '01' },
  { day: 'Dim.', date: '02' },
  { day: 'Lun.', date: '03' },
];

const SPORTS = [
  { id: 'all', label: 'Tous', icon: 'apps-outline' as const },
  { id: 'Basketball', label: 'Basketball', icon: 'basketball-outline' as const },
  { id: 'Football', label: 'Football', icon: 'football-outline' as const },
  { id: 'Natation', label: 'Natation', icon: 'water-outline' as const },
  { id: 'Athletisme', label: 'Athlétisme', icon: 'walk-outline' as const },
  { id: 'Judo', label: 'Judo', icon: 'body-outline' as const },
];

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const t = useTranslation(state.language);
  const C = getColors(state.theme);

  const [tab, setTab] = useState<Tab>('live');
  const [dayIdx, setDayIdx] = useState(0);
  const [sport, setSport] = useState('all');

  // Filter events by selected sport
  const filteredEvents = sport === 'all'
    ? EVENTS
    : EVENTS.filter((e) => e.sport.toLowerCase() === sport.toLowerCase());

  const s = makeStyles(C);

  return (
    <View style={[s.container, { backgroundColor: C.bg }]}>
      <StatusBar style={state.theme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient colors={[C.bg, C.bgElevated, C.bg]} style={StyleSheet.absoluteFill} />

      <View style={[s.header, { paddingTop: insets.top + 8, borderBottomColor: C.border1 }]}>
        <Text style={[s.headerTitle, { color: C.text }]}>Programme JOJ</Text>
        <View style={s.tabs}>
          <TabBtn active={tab === 'programme'} onPress={() => setTab('programme')} icon="calendar-outline" label={t.programme} C={C} />
          <TabBtn active={tab === 'live'} onPress={() => setTab('live')} icon="radio-outline" label={t.live} badge={LIVE_SCORES.length} C={C} />
          <TabBtn active={tab === 'medailles'} onPress={() => setTab('medailles')} icon="medal-outline" label={t.medals} C={C} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'programme' && (
          <>
            {/* Day selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dayList}>
              {DAYS.map((d, i) => (
                <Pressable
                  key={i}
                  onPress={() => setDayIdx(i)}
                  style={[
                    s.dayItem,
                    { backgroundColor: C.surface2, borderColor: C.border1 },
                    i === dayIdx && { backgroundColor: C.brand, borderColor: C.brand },
                  ]}
                >
                  <Text style={[s.dayName, { color: C.textTertiary }, i === dayIdx && { color: '#fff' }]}>{d.day}</Text>
                  <Text style={[s.dayDate, { color: C.textSecondary }, i === dayIdx && { color: '#fff' }]}>{d.date}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Sport filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.sportList}>
              {SPORTS.map((sp) => (
                <Pressable
                  key={sp.id}
                  onPress={() => setSport(sp.id)}
                  style={[
                    s.sportPill,
                    { backgroundColor: C.surface1, borderColor: C.border1 },
                    sp.id === sport && { backgroundColor: C.surface3, borderColor: C.border2 },
                  ]}
                >
                  <Ionicons name={sp.icon} size={14} color={sp.id === sport ? C.text : C.textTertiary} />
                  <Text style={[s.sportText, { color: C.textTertiary }, sp.id === sport && { color: C.text }]}>{sp.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Filtered events */}
            {filteredEvents.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40, gap: 10 }}>
                <Ionicons name="calendar-outline" size={40} color={C.textTertiary} />
                <Text style={{ fontSize: 15, color: C.textTertiary, fontWeight: '600' }}>Aucun événement pour ce sport</Text>
              </View>
            ) : (
              filteredEvents.map((e) => <EventCard key={e.id} event={e} C={C} />)
            )}
          </>
        )}

        {tab === 'live' && (
          <>
            <View style={[s.liveHeader]}>
              <View style={[s.liveDot, { backgroundColor: C.liveDot }]} />
              <Text style={[s.liveHeaderText, { color: C.liveDot }]}>{LIVE_SCORES.length} compétitions en direct</Text>
            </View>
            {LIVE_SCORES.map((sc) => <FullLive key={sc.id} score={sc} C={C} />)}
          </>
        )}

        {tab === 'medailles' && (
          <>
            <View style={[s.medalHeader, { borderRadius: Radius.lg, overflow: 'hidden', marginBottom: 8 }]}>
              <LinearGradient colors={[C.gold, C.gold + 'AA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18 }}>
                <Ionicons name="trophy" size={28} color="#fff" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff' }}>Tableau des médailles</Text>
                  <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Dakar 2026</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 12, paddingBottom: 10, gap: 0 }}>
                {['OR', 'ARG', 'BRZ', 'TOT'].map((col) => (
                  <Text key={col} style={{ width: 40, textAlign: 'center', fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 }}>{col}</Text>
                ))}
              </View>
            </View>
            {MEDAL_TABLE.map((row) => <MedalRow key={row.rank} row={row} C={C} />)}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function TabBtn({
  active,
  onPress,
  icon,
  label,
  badge,
  C,
}: {
  active: boolean;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
  C: ReturnType<typeof getColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: Radius.full,
        backgroundColor: active ? C.surface3 : C.surface1,
        borderWidth: 1,
        borderColor: active ? C.border2 : C.border1,
      }}
    >
      <Ionicons name={icon} size={15} color={active ? C.text : C.textTertiary} />
      <Text style={{ fontSize: 13, fontWeight: '600', color: active ? C.text : C.textTertiary }}>{label}</Text>
      {badge !== undefined && badge > 0 && (
        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.liveDot, alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff' }}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

function EventCard({ event, C }: { event: (typeof EVENTS)[0]; C: ReturnType<typeof getColors> }) {
  return (
    <Pressable style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 14, gap: 12, marginBottom: 8 }}>
      <SportIcon sport={event.sport} size={20} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 1, color: C.brand }}>{event.sport.toUpperCase()}  ·  {event.category}</Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{event.match}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Ionicons name="location-outline" size={11} color={C.textTertiary} />
          <Text style={{ fontSize: 12, color: C.textTertiary }}>{event.venue}</Text>
        </View>
      </View>
      <View>
        {event.status === 'live' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.liveDot + '20', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.liveDot }} />
            <Text style={{ fontSize: 10, fontWeight: '800', color: C.liveDot, letterSpacing: 0.6 }}>LIVE</Text>
          </View>
        ) : event.status === 'finished' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: C.surface1, borderRadius: Radius.full }}>
            <Ionicons name="checkmark" size={11} color={C.textTertiary} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.textTertiary }}>Terminé</Text>
          </View>
        ) : (
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{event.time}</Text>
        )}
      </View>
    </Pressable>
  );
}

function FullLive({ score, C }: { score: (typeof LIVE_SCORES)[0]; C: ReturnType<typeof getColors> }) {
  return (
    <View style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 18, gap: 14, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.liveDot + '20', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.liveDot }} />
          <Text style={{ fontSize: 10, fontWeight: '800', color: C.liveDot, letterSpacing: 0.6 }}>LIVE</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.text, flex: 1 }}>{score.sport}</Text>
        <Text style={{ fontSize: 13, color: C.textSecondary, fontWeight: '600' }}>{score.period}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, alignItems: 'center', gap: 8 }}>
          <CountryBadge code={score.homeCode} size="lg" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, textAlign: 'center' }}>{score.homeTeam}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 42, fontWeight: '900', color: C.text }}>{score.homeScore}</Text>
          <Text style={{ fontSize: 22, color: C.textTertiary }}>:</Text>
          <Text style={{ fontSize: 42, fontWeight: '900', color: C.text }}>{score.awayScore}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', gap: 8 }}>
          <CountryBadge code={score.awayCode} size="lg" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, textAlign: 'center' }}>{score.awayTeam}</Text>
        </View>
      </View>
      <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: Radius.md, backgroundColor: C.surface3, borderWidth: 1, borderColor: C.border1 }}>
        <Ionicons name="stats-chart-outline" size={15} color={C.text} />
        <Text style={{ fontSize: 13, fontWeight: '600', color: C.textSecondary }}>Statistiques détaillées</Text>
      </Pressable>
    </View>
  );
}

function MedalRow({ row, C }: { row: (typeof MEDAL_TABLE)[0]; C: ReturnType<typeof getColors> }) {
  const total = row.gold + row.silver + row.bronze;
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: row.rank === 1 ? C.gold + '08' : C.surface2,
      borderWidth: 1, borderColor: row.rank === 1 ? C.gold + '40' : C.border1,
      borderRadius: Radius.md, padding: 12, marginBottom: 6,
    }}>
      <Text style={{ fontSize: 14, fontWeight: '800', color: row.rank === 1 ? C.gold : C.textTertiary, width: 18, textAlign: 'center' }}>{row.rank}</Text>
      <CountryBadge code={row.code} size="sm" />
      <Text style={{ fontSize: 15, fontWeight: '600', color: C.text, flex: 1 }}>{row.country}</Text>
      <View style={{ flexDirection: 'row' }}>
        {[row.gold, row.silver, row.bronze, total].map((n, i) => (
          <Text key={i} style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: i === 3 ? '900' : '700', color: i === 3 ? C.textSecondary : C.text }}>{n}</Text>
        ))}
      </View>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
    headerTitle: { fontSize: 21, fontWeight: '800' },
    tabs: { flexDirection: 'row', gap: 6 },
    scroll: { padding: 16, gap: 8 },

    dayList: { gap: 8, paddingBottom: 8 },
    dayItem: { width: 56, height: 70, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, gap: 4 },
    dayName: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    dayDate: { fontSize: 18, fontWeight: '900' },

    sportList: { gap: 8, paddingBottom: 12 },
    sportPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1 },
    sportText: { fontSize: 13, fontWeight: '600' },

    liveHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4, marginBottom: 4 },
    liveDot: { width: 8, height: 8, borderRadius: 4 },
    liveHeaderText: { fontSize: 13, fontWeight: '700' },

    medalHeader: {},
  });
}
