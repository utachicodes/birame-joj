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
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import { Colors, Typography, Radius, Shadows } from '../theme';
import { EVENTS, LIVE_SCORES, MEDAL_TABLE } from '../data/mock';

const { width } = Dimensions.get('window');

type Tab = 'programme' | 'live' | 'medailles';

const DAYS = ['Auj.', 'Dem.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.', 'Lun.'];
const DATES = ['28', '29', '30', '31', '01', '02', '03'];

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('live');
  const [dayIdx, setDayIdx] = useState(0);
  const [sport, setSport] = useState('Tous');

  const sports = ['Tous', '🏀', '⚽', '🏊', '🏃', '🥋', '🤾', '🏐'];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#050A18', '#0A1A2E', '#050A18']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.blob1} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,10,24,0.5)' }]} />

        <Text style={styles.headerTitle}>Programme JOJ</Text>

        {/* Main tabs */}
        <View style={styles.mainTabs}>
          {(['programme', 'live', 'medailles'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.mainTab, t === tab && styles.mainTabActive]}
            >
              <Text style={[styles.mainTabText, t === tab && styles.mainTabTextActive]}>
                {t === 'programme' ? 'Programme' : t === 'live' ? '🔴 Direct' : '🏅 Médailles'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.headerBorder} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'programme' && (
          <>
            {/* Day selector */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayList}
            >
              {DAYS.map((day, i) => (
                <Pressable
                  key={i}
                  onPress={() => setDayIdx(i)}
                  style={[styles.dayItem, i === dayIdx && styles.dayItemActive]}
                >
                  {i === dayIdx && (
                    <LinearGradient
                      colors={[Colors.orange, Colors.orangeLight]}
                      style={StyleSheet.absoluteFill}
                    />
                  )}
                  <Text style={[styles.dayName, i === dayIdx && styles.dayTextActive]}>{day}</Text>
                  <Text style={[styles.dayDate, i === dayIdx && styles.dayTextActive]}>{DATES[i]}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Sport filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sportList}
            >
              {sports.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSport(s)}
                  style={[styles.sportPill, s === sport && styles.sportPillActive]}
                >
                  <Text style={[styles.sportText, s === sport && styles.sportTextActive]}>{s}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Events */}
            {EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </>
        )}

        {tab === 'live' && (
          <>
            <Text style={styles.liveNote}>
              🔴 {LIVE_SCORES.length} compétitions en cours
            </Text>
            {LIVE_SCORES.map((score) => (
              <FullLiveCard key={score.id} score={score} />
            ))}
          </>
        )}

        {tab === 'medailles' && (
          <>
            <GlassCard style={styles.medalHeader} variant="strong">
              <LinearGradient
                colors={['rgba(201,168,76,0.3)', 'rgba(201,168,76,0.05)']}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.medalTitle}>Tableau des médailles</Text>
              <Text style={styles.medalSub}>Jeux de la Francophonie · Dakar 2026</Text>
              <View style={styles.medalHeaderRow}>
                {['🥇', '🥈', '🥉', 'Total'].map((m) => (
                  <Text key={m} style={styles.medalCol}>{m}</Text>
                ))}
              </View>
            </GlassCard>
            {MEDAL_TABLE.map((row, i) => (
              <MedalRow key={row.rank} row={row} isTop={i === 0} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function EventCard({ event }: { event: (typeof EVENTS)[0] }) {
  return (
    <GlassCard style={styles.eventCard} onPress={() => {}}>
      {event.status === 'live' && (
        <LinearGradient
          colors={[event.color + '20', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={[styles.eventAccent, { backgroundColor: event.color }]} />

      <View style={styles.eventCardContent}>
        <View style={styles.eventCardLeft}>
          <Text style={styles.eventBig}>{event.icon}</Text>
        </View>
        <View style={styles.eventCardMid}>
          <Text style={styles.eventCardSport}>{event.sport} · {event.category}</Text>
          <Text style={styles.eventCardMatch}>{event.match}</Text>
          <View style={styles.eventCardMeta}>
            <Ionicons name="location-outline" size={12} color={Colors.textTertiary} />
            <Text style={styles.eventCardMetaText}>{event.venue}</Text>
          </View>
        </View>
        <View style={styles.eventCardRight}>
          {event.status === 'live' ? (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          ) : event.status === 'finished' ? (
            <Text style={styles.finishedBadge}>Terminé</Text>
          ) : (
            <Text style={styles.eventCardTime}>{event.time}</Text>
          )}
          <Pressable style={styles.favoriteBtn}>
            <Ionicons name="bookmark-outline" size={18} color={Colors.textTertiary} />
          </Pressable>
        </View>
      </View>
    </GlassCard>
  );
}

function FullLiveCard({ score }: { score: (typeof LIVE_SCORES)[0] }) {
  return (
    <GlassCard style={styles.fullLiveCard} variant="strong">
      <LinearGradient
        colors={[score.color + '25', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.fullLiveHeader}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
        <Text style={styles.fullLiveSport}>{score.sport}</Text>
        <Text style={styles.fullLivePeriod}>{score.period}</Text>
      </View>

      <View style={styles.fullScoreRow}>
        <View style={styles.fullTeam}>
          <Text style={styles.fullFlag}>{score.homeFlag}</Text>
          <Text style={styles.fullTeamName}>{score.homeTeam}</Text>
        </View>
        <View style={styles.fullScoreMid}>
          <Text style={styles.fullScore}>{score.homeScore}</Text>
          <Text style={styles.fullScoreSep}>:</Text>
          <Text style={styles.fullScore}>{score.awayScore}</Text>
        </View>
        <View style={styles.fullTeam}>
          <Text style={styles.fullFlag}>{score.awayFlag}</Text>
          <Text style={styles.fullTeamName}>{score.awayTeam}</Text>
        </View>
      </View>

      <Pressable style={styles.watchBtn}>
        
        <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.glass1, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border1 }]} />
        <Ionicons name="stats-chart-outline" size={16} color={Colors.text} />
        <Text style={styles.watchBtnText}>Statistiques détaillées</Text>
      </Pressable>
    </GlassCard>
  );
}

function MedalRow({ row, isTop }: { row: (typeof MEDAL_TABLE)[0]; isTop: boolean }) {
  return (
    <GlassCard
      style={[styles.medalRow, isTop && styles.medalRowTop]}
      variant={isTop ? 'strong' : 'default'}
    >
      {isTop && (
        <LinearGradient
          colors={['rgba(201,168,76,0.2)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.medalRowContent}>
        <Text style={[styles.medalRank, isTop && styles.medalRankTop]}>#{row.rank}</Text>
        <Text style={styles.medalFlag}>{row.flag}</Text>
        <Text style={styles.medalCountry}>{row.country}</Text>
        <View style={styles.medalCounts}>
          <Text style={styles.medalNum}>{row.gold}</Text>
          <Text style={styles.medalNum}>{row.silver}</Text>
          <Text style={styles.medalNum}>{row.bronze}</Text>
          <Text style={[styles.medalNum, styles.medalTotal]}>
            {row.gold + row.silver + row.bronze}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  blob1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.blue + '08',
    top: 50,
    left: -60,
  },
  header: { overflow: 'hidden' },
  headerTitle: { ...Typography.title2, fontWeight: '800', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 14 },
  mainTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 4,
  },
  mainTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border1,
    backgroundColor: Colors.glass1,
  },
  mainTabActive: {
    backgroundColor: Colors.glass3,
    borderColor: Colors.border2,
  },
  mainTabText: { ...Typography.footnote, color: Colors.textTertiary, fontWeight: '600' },
  mainTabTextActive: { color: Colors.text },
  headerBorder: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1 },
  scroll: { padding: 16, gap: 10 },
  dayList: { gap: 8, paddingVertical: 4, marginBottom: 4 },
  dayItem: {
    width: 56,
    height: 70,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glass1,
    borderWidth: 1,
    borderColor: Colors.border1,
    overflow: 'hidden',
    gap: 4,
  },
  dayItemActive: { borderColor: Colors.orange + '60' },
  dayName: { ...Typography.caption, color: Colors.textTertiary, fontWeight: '600' },
  dayDate: { ...Typography.title3, fontWeight: '800', color: Colors.textSecondary },
  dayTextActive: { color: '#fff' },
  sportList: { gap: 8, paddingBottom: 8 },
  sportPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border1,
    backgroundColor: Colors.glass1,
  },
  sportPillActive: { backgroundColor: Colors.glass3, borderColor: Colors.border2 },
  sportText: { fontSize: 16, color: Colors.textTertiary },
  sportTextActive: { color: Colors.text },
  eventCard: { overflow: 'hidden' },
  eventAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  eventCardContent: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingLeft: 18, gap: 12 },
  eventCardLeft: { width: 36 },
  eventBig: { fontSize: 28 },
  eventCardMid: { flex: 1, gap: 3 },
  eventCardSport: { ...Typography.label, color: Colors.textTertiary },
  eventCardMatch: { ...Typography.callout, fontWeight: '700' },
  eventCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  eventCardMetaText: { ...Typography.caption, color: Colors.textTertiary },
  eventCardRight: { alignItems: 'flex-end', gap: 8 },
  eventCardTime: { ...Typography.callout, fontWeight: '700' },
  finishedBadge: { ...Typography.caption, color: Colors.textTertiary, fontWeight: '600' },
  favoriteBtn: { padding: 4 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.error + '25',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error },
  liveBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.error, letterSpacing: 0.5 },
  liveNote: { ...Typography.footnote, color: Colors.error, fontWeight: '600', marginBottom: 4 },
  fullLiveCard: { padding: 20, gap: 16, overflow: 'hidden' },
  fullLiveHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fullLiveSport: { ...Typography.callout, fontWeight: '600', flex: 1 },
  fullLivePeriod: { ...Typography.footnote, color: Colors.textSecondary, fontWeight: '600' },
  fullScoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fullTeam: { flex: 1, alignItems: 'center', gap: 8 },
  fullFlag: { fontSize: 36 },
  fullTeamName: { ...Typography.callout, fontWeight: '700', textAlign: 'center' },
  fullScoreMid: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fullScore: { fontSize: 48, fontWeight: '900', color: Colors.text },
  fullScoreSep: { ...Typography.title1, color: Colors.textTertiary },
  watchBtn: {
    height: 44,
    borderRadius: Radius.md,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  watchBtnText: { ...Typography.callout, fontWeight: '600' },
  medalHeader: { padding: 20, gap: 6, overflow: 'hidden' },
  medalTitle: { ...Typography.title3, fontWeight: '800' },
  medalSub: { ...Typography.footnote, color: Colors.textSecondary },
  medalHeaderRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 0, marginTop: 8 },
  medalCol: { width: 48, textAlign: 'center', ...Typography.caption, fontWeight: '700' },
  medalRow: { overflow: 'hidden' },
  medalRowTop: {},
  medalRowContent: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  medalRank: { ...Typography.footnote, color: Colors.textTertiary, fontWeight: '700', width: 24 },
  medalRankTop: { color: Colors.gold },
  medalFlag: { fontSize: 22 },
  medalCountry: { ...Typography.callout, fontWeight: '600', flex: 1 },
  medalCounts: { flexDirection: 'row', gap: 0 },
  medalNum: { width: 48, textAlign: 'center', ...Typography.callout, fontWeight: '700', color: Colors.text },
  medalTotal: { color: Colors.textSecondary },
});
