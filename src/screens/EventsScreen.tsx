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
import CountryBadge from '../components/CountryBadge';
import SportIcon from '../components/SportIcon';
import { Colors, Typography, Radius } from '../theme';
import { EVENTS, LIVE_SCORES, MEDAL_TABLE } from '../data/mock';

// three tabs this screen can show
type Tab = 'programme' | 'live' | 'medailles';

// days shown in the horizontal day picker
const DAYS = [
  { day: 'Auj.', date: '28' },
  { day: 'Mer.', date: '29' },
  { day: 'Jeu.', date: '30' },
  { day: 'Ven.', date: '31' },
  { day: 'Sam.', date: '01' },
  { day: 'Dim.', date: '02' },
  { day: 'Lun.', date: '03' },
];

// sport filter pills; 'all' means no filter
const SPORTS = [
  { id: 'all', label: 'Tous', icon: 'apps-outline' as const },
  { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' as const },
  { id: 'football', label: 'Football', icon: 'football-outline' as const },
  { id: 'natation', label: 'Natation', icon: 'water-outline' as const },
  { id: 'athletisme', label: 'Athlétisme', icon: 'walk-outline' as const },
  { id: 'judo', label: 'Judo', icon: 'body-outline' as const },
];

export default function EventsScreen() {
  const insets = useSafeAreaInsets(); // safe area so notch doesn't clip header
  const [tab, setTab] = useState<Tab>('live'); // start on live tab
  const [dayIdx, setDayIdx] = useState(0); // which day is selected in picker
  const [sport, setSport] = useState('all'); // active sport filter

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bg]} style={StyleSheet.absoluteFill} /> {/* subtle gradient bg */}

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Programme JOJ</Text>
        <View style={styles.tabs}>
          <TabBtn active={tab === 'programme'} onPress={() => setTab('programme')} icon="calendar-outline" label="Programme" />
          <TabBtn active={tab === 'live'} onPress={() => setTab('live')} icon="radio-outline" label="Direct" badge={LIVE_SCORES.length} /> {/* badge shows live count */}
          <TabBtn active={tab === 'medailles'} onPress={() => setTab('medailles')} icon="medal-outline" label="Médailles" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]} // leave room for tab bar
        showsVerticalScrollIndicator={false}
      >
        {tab === 'programme' && (
          <>
            {/* horizontal day selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayList}>
              {DAYS.map((d, i) => (
                <Pressable key={i} onPress={() => setDayIdx(i)} style={[styles.dayItem, i === dayIdx && styles.dayItemActive]}>
                  <Text style={[styles.dayName, i === dayIdx && styles.dayTextActive]}>{d.day}</Text>
                  <Text style={[styles.dayDate, i === dayIdx && styles.dayTextActive]}>{d.date}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* horizontal sport filter row */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sportList}>
              {SPORTS.map((s) => (
                <Pressable key={s.id} onPress={() => setSport(s.id)} style={[styles.sportPill, s.id === sport && styles.sportPillActive]}>
                  <Ionicons name={s.icon} size={14} color={s.id === sport ? Colors.text : Colors.textTertiary} />
                  <Text style={[styles.sportText, s.id === sport && styles.sportTextActive]}>{s.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {EVENTS.map((e) => <EventCard key={e.id} event={e} />)} {/* one card per event */}
          </>
        )}

        {tab === 'live' && (
          <>
            <View style={styles.liveHeader}>
              <View style={styles.liveDot} /> {/* red pulsing indicator */}
              <Text style={styles.liveHeaderText}>{LIVE_SCORES.length} compétitions en direct</Text>
            </View>
            {LIVE_SCORES.map((s) => <FullLive key={s.id} score={s} />)} {/* full scorecards */}
          </>
        )}

        {tab === 'medailles' && (
          <>
            <View style={styles.medalHeader}>
              <LinearGradient colors={[Colors.gold, '#A88A2C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /> {/* gold gradient banner */}
              <View style={styles.medalHeaderContent}>
                <Ionicons name="trophy" size={28} color="#fff" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.medalTitle}>Tableau des médailles</Text>
                  <Text style={styles.medalSub}>Dakar 2026</Text>
                </View>
              </View>
              <View style={styles.medalCols}>
                {/* column headers for the medal table */}
                <Text style={styles.medalColText}>OR</Text>
                <Text style={styles.medalColText}>ARG</Text>
                <Text style={styles.medalColText}>BRZ</Text>
                <Text style={styles.medalColText}>TOT</Text>
              </View>
            </View>
            {MEDAL_TABLE.map((row) => <MedalRow key={row.rank} row={row} />)}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// reusable tab button with optional notification badge
function TabBtn({ active, onPress, icon, label, badge }: { active: boolean; onPress: () => void; icon: any; label: string; badge?: number }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Ionicons name={icon} size={15} color={active ? Colors.text : Colors.textTertiary} />
      <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{label}</Text>
      {badge && ( // only render badge when there's a count
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

// compact event row used in the programme tab
function EventCard({ event }: { event: (typeof EVENTS)[0] }) {
  return (
    <Pressable style={styles.eventCard}>
      <SportIcon sport={event.sport} size={20} /> {/* sport-specific icon */}
      <View style={styles.eventInfo}>
        <Text style={styles.eventCategory}>{event.sport.toUpperCase()}  ·  {event.category}</Text>
        <Text style={styles.eventMatch}>{event.match}</Text>
        <View style={styles.eventMeta}>
          <Ionicons name="location-outline" size={11} color={Colors.textTertiary} />
          <Text style={styles.eventMetaText}>{event.venue}</Text>
        </View>
      </View>
      <View style={styles.eventTime}>
        {event.status === 'live' ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveBadgeDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        ) : event.status === 'finished' ? (
          <View style={styles.finishedBadge}>
            <Ionicons name="checkmark" size={11} color={Colors.textTertiary} />
            <Text style={styles.finishedText}>Terminé</Text>
          </View>
        ) : (
          <Text style={styles.eventTimeText}>{event.time}</Text> // upcoming, show time
        )}
      </View>
    </Pressable>
  );
}

// expanded live score card with team flags and stats CTA
function FullLive({ score }: { score: (typeof LIVE_SCORES)[0] }) {
  return (
    <View style={styles.fullLive}>
      <View style={styles.fullLiveHeader}>
        <View style={styles.liveBadge}>
          <View style={styles.liveBadgeDot} />
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
        <Text style={styles.fullLiveSport}>{score.sport}</Text>
        <Text style={styles.fullLivePeriod}>{score.period}</Text> {/* e.g. "2nd Half" */}
      </View>
      <View style={styles.fullLiveTeams}>
        <View style={styles.fullLiveTeam}>
          <CountryBadge code={score.homeCode} size="lg" />
          <Text style={styles.fullLiveTeamName}>{score.homeTeam}</Text>
        </View>
        <View style={styles.fullLiveScoreWrap}>
          <Text style={styles.fullLiveScore}>{score.homeScore}</Text>
          <Text style={styles.fullLiveScoreSep}>:</Text>
          <Text style={styles.fullLiveScore}>{score.awayScore}</Text>
        </View>
        <View style={styles.fullLiveTeam}>
          <CountryBadge code={score.awayCode} size="lg" />
          <Text style={styles.fullLiveTeamName}>{score.awayTeam}</Text>
        </View>
      </View>
      <Pressable style={styles.fullLiveCta}>
        <Ionicons name="stats-chart-outline" size={15} color={Colors.text} />
        <Text style={styles.fullLiveCtaText}>Statistiques détaillées</Text>
      </Pressable>
    </View>
  );
}

// single row in the medal table
function MedalRow({ row }: { row: (typeof MEDAL_TABLE)[0] }) {
  const total = row.gold + row.silver + row.bronze; // compute total here, not in data
  return (
    <View style={[styles.medalRow, row.rank === 1 && styles.medalRowFirst]}> {/* gold tint for top ranked */}
      <Text style={[styles.medalRank, row.rank === 1 && styles.medalRankFirst]}>{row.rank}</Text>
      <CountryBadge code={row.code} size="sm" />
      <Text style={styles.medalCountry}>{row.country}</Text>
      <View style={styles.medalNums}>
        <Text style={styles.medalNum}>{row.gold}</Text>
        <Text style={styles.medalNum}>{row.silver}</Text>
        <Text style={styles.medalNum}>{row.bronze}</Text>
        <Text style={[styles.medalNum, styles.medalNumTotal]}>{total}</Text> {/* slightly dimmer total */}
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
  tabBadge: { width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.liveDot, alignItems: 'center', justifyContent: 'center', marginLeft: 2 },
  tabBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  scroll: { padding: 16, gap: 8 },
  dayList: { gap: 8, paddingBottom: 8 },
  dayItem: { width: 56, height: 70, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, gap: 4 },
  dayItemActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  dayName: { fontSize: 11, fontWeight: '700', color: Colors.textTertiary, textTransform: 'uppercase' },
  dayDate: { fontSize: 18, fontWeight: '900', color: Colors.textSecondary },
  dayTextActive: { color: '#fff' },
  sportList: { gap: 8, paddingBottom: 12 },
  sportPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.surface1, borderWidth: 1, borderColor: Colors.border1 },
  sportPillActive: { backgroundColor: Colors.surface3, borderColor: Colors.border2 },
  sportText: { fontSize: 13, color: Colors.textTertiary, fontWeight: '600' },
  sportTextActive: { color: Colors.text },
  eventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 14, gap: 12, marginBottom: 8 },
  eventInfo: { flex: 1, gap: 3 },
  eventCategory: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: Colors.brand },
  eventMatch: { ...Typography.callout, fontWeight: '700' },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  eventMetaText: { ...Typography.caption, color: Colors.textTertiary },
  eventTime: { alignItems: 'flex-end' },
  eventTimeText: { ...Typography.callout, fontWeight: '700', color: Colors.text },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.liveDot + '20', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  liveBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.liveDot },
  liveBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.liveDot, letterSpacing: 0.6 },
  finishedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: Colors.surface1, borderRadius: Radius.full },
  finishedText: { fontSize: 10, fontWeight: '700', color: Colors.textTertiary },
  liveHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4, marginBottom: 4 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.liveDot },
  liveHeaderText: { ...Typography.footnote, color: Colors.liveDot, fontWeight: '700' },
  fullLive: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 18, gap: 14, marginBottom: 8 },
  fullLiveHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fullLiveSport: { ...Typography.callout, fontWeight: '600', flex: 1 },
  fullLivePeriod: { ...Typography.footnote, color: Colors.textSecondary, fontWeight: '600' },
  fullLiveTeams: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fullLiveTeam: { flex: 1, alignItems: 'center', gap: 8 },
  fullLiveTeamName: { ...Typography.callout, fontWeight: '700', textAlign: 'center' },
  fullLiveScoreWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8 },
  fullLiveScore: { fontSize: 42, fontWeight: '900', color: Colors.text },
  fullLiveScoreSep: { fontSize: 22, color: Colors.textTertiary },
  fullLiveCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: Radius.md, backgroundColor: Colors.surface3, borderWidth: 1, borderColor: Colors.border1 },
  fullLiveCtaText: { ...Typography.footnote, fontWeight: '600' },
  medalHeader: { borderRadius: Radius.lg, overflow: 'hidden', marginBottom: 8 },
  medalHeaderContent: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18 },
  medalTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  medalSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  medalCols: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 12, paddingBottom: 10, gap: 0 },
  medalColText: { width: 40, textAlign: 'center', fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },
  medalRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.md, padding: 12, marginBottom: 6 },
  medalRowFirst: { borderColor: Colors.gold + '40', backgroundColor: Colors.gold + '08' },
  medalRank: { fontSize: 14, fontWeight: '800', color: Colors.textTertiary, width: 18, textAlign: 'center' },
  medalRankFirst: { color: Colors.gold },
  medalCountry: { ...Typography.callout, fontWeight: '600', flex: 1 },
  medalNums: { flexDirection: 'row' },
  medalNum: { width: 40, textAlign: 'center', fontSize: 14, fontWeight: '700', color: Colors.text },
  medalNumTotal: { color: Colors.textSecondary },
});
