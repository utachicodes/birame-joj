import React from 'react';
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
import { useRouter } from 'expo-router';
import CountryBadge from '../components/CountryBadge';
import SportIcon from '../components/SportIcon';
import { getColors, Radius, Shadows, Typography } from '../theme';
import { USER, LIVE_SCORES, EVENTS, TICKETS } from '../data/mock';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const QUICK_W = (width - 40 - 24) / 3;

const QUICK_ACTIONS: Array<{
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
}> = [
  { id: '1', icon: 'ticket-outline', label: 'Mes Billets', route: '/tickets' },
  { id: '2', icon: 'map-outline', label: 'Carte', route: '/map' },
  { id: '3', icon: 'bus-outline', label: 'Transport', route: '/transport' },
  { id: '4', icon: 'restaurant-outline', label: 'Commander', route: '/food' },
  { id: '5', icon: 'medal-outline', label: 'Médailles', route: '/events' },
  { id: '6', icon: 'wallet-outline', label: 'Wallet', route: '/wallet' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state } = useApp();
  const C = getColors(state.theme);
  const s = makeStyles(C);

  return (
    <View style={s.container}>
      <StatusBar style={state.theme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient
        colors={[C.bg, C.bgElevated, C.bg]}
        style={StyleSheet.absoluteFill}
      />
      <View style={s.glow} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.greeting}>Bonjour,</Text>
            <Text style={s.userName}>{USER.name}</Text>
            <View style={s.userMeta}>
              <CountryBadge code={USER.countryCode} size="sm" />
              <Text style={s.userMetaText}>
                {USER.country}  ·  {USER.role}
              </Text>
            </View>
          </View>
          <Pressable style={s.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={C.text} />
            <View style={s.dot} />
          </Pressable>
        </View>

        <Pressable style={s.hero}>
          <LinearGradient
            colors={[C.brand, C.brandDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.heroPattern}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  s.heroCircle,
                  {
                    width: 180 + i * 80,
                    height: 180 + i * 80,
                    borderRadius: (180 + i * 80) / 2,
                    right: -60 - i * 30,
                    top: -40 - i * 20,
                  },
                ]}
              />
            ))}
          </View>
          <View style={s.heroContent}>
            <View>
              <Text style={s.heroLabel}>JEUX EN COURS</Text>
              <Text style={s.heroTitle}>Dakar 2026</Text>
              <Text style={s.heroSub}>27 Jul — 06 Août  ·  11 disciplines</Text>
            </View>
            <View style={s.heroDay}>
              <Text style={s.heroDayNum}>J+2</Text>
              <Text style={s.heroDayLabel}>JOUR</Text>
            </View>
          </View>
          <View style={s.heroBar}>
            <View style={[s.heroBarFill, { width: '18%' }]} />
          </View>
        </Pressable>

        <Pressable style={s.walletRow} onPress={() => router.push('/wallet' as any)}>
          <View style={s.walletIcon}>
            <Ionicons name="wallet-outline" size={22} color={C.gold} />
          </View>
          <View style={s.walletText}>
            <Text style={s.walletLabel}>Solde JOJ Wallet</Text>
            <Text style={s.walletValue}>
              {USER.walletBalance.toLocaleString('fr-FR')}
              <Text style={s.walletCcy}>  XOF</Text>
            </Text>
          </View>
          <View style={s.walletCta}>
            <Text style={s.walletCtaText}>Recharger</Text>
            <Ionicons name="arrow-forward" size={14} color={C.brand} />
          </View>
        </Pressable>

        <SectionHeader title="Accès rapide" C={C} />
        <View style={s.quickGrid}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable key={a.id} style={s.quickItem} onPress={() => router.push(a.route as any)}>
              <View style={s.quickIconBox}>
                <Ionicons name={a.icon} size={22} color={C.text} />
              </View>
              <Text style={s.quickLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <SectionHeader title="En direct" dot C={C} right="Tout voir" onRight={() => router.push('/events')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
          {LIVE_SCORES.map((sc) => <LiveCard key={sc.id} score={sc} C={C} />)}
        </ScrollView>

        <SectionHeader title="Prochain événement" right="Mes billets" C={C} onRight={() => router.push('/tickets')} />
        <NextTicket ticket={TICKETS[0]} C={C} />

        <SectionHeader title="Programme du jour" right="Voir tout" C={C} onRight={() => router.push('/events')} />
        {EVENTS.slice(0, 3).map((e) => <EventRow key={e.id} event={e} C={C} />)}
      </ScrollView>
    </View>
  );
}

type C = ReturnType<typeof getColors>;

function SectionHeader({ title, right, onRight, dot, C }: { title: string; right?: string; onRight?: () => void; dot?: boolean; C: C }) {
  const s = makeStyles(C);
  return (
    <View style={s.sectionHeader}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {dot && <View style={s.liveDot} />}
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      {right && (
        <Pressable onPress={onRight}>
          <Text style={s.sectionAction}>{right}</Text>
        </Pressable>
      )}
    </View>
  );
}

function LiveCard({ score, C }: { score: (typeof LIVE_SCORES)[0]; C: C }) {
  const s = makeStyles(C);
  return (
    <View style={s.liveCard}>
      <View style={s.liveCardHeader}>
        <View style={s.liveBadge}>
          <View style={s.liveBadgeDot} />
          <Text style={s.liveBadgeText}>LIVE</Text>
        </View>
        <Text style={s.liveSport}>{score.sport}</Text>
      </View>
      <View style={s.liveTeams}>
        <View style={s.liveTeam}>
          <CountryBadge code={score.homeCode} size="md" />
          <Text style={s.liveTeamName}>{score.homeTeam}</Text>
        </View>
        <View style={s.liveScore}>
          <Text style={s.liveScoreNum}>{score.homeScore}</Text>
          <Text style={s.liveScoreSep}>:</Text>
          <Text style={s.liveScoreNum}>{score.awayScore}</Text>
        </View>
        <View style={s.liveTeam}>
          <CountryBadge code={score.awayCode} size="md" />
          <Text style={s.liveTeamName}>{score.awayTeam}</Text>
        </View>
      </View>
      <Text style={s.livePeriod}>{score.period}</Text>
    </View>
  );
}

function NextTicket({ ticket, C }: { ticket: (typeof TICKETS)[0]; C: C }) {
  const s = makeStyles(C);
  return (
    <Pressable style={s.ticket}>
      <View style={s.ticketIconWrap}>
        <Ionicons name={ticket.icon} size={22} color={C.brand} />
      </View>
      <View style={s.ticketBody}>
        <View style={s.ticketTopRow}>
          <Text style={s.ticketCat}>{ticket.type}</Text>
          <View style={s.ticketStatus}>
            <View style={s.ticketStatusDot} />
            <Text style={s.ticketStatusText}>Actif</Text>
          </View>
        </View>
        <Text style={s.ticketEvent}>{ticket.event}</Text>
        <Text style={s.ticketVenue}>{ticket.venue}</Text>
        <View style={s.ticketMeta}>
          <Ionicons name="time-outline" size={13} color={C.textTertiary} />
          <Text style={s.ticketMetaText}>{ticket.date}  ·  {ticket.time}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.textTertiary} />
    </Pressable>
  );
}

function EventRow({ event, C }: { event: (typeof EVENTS)[0]; C: C }) {
  const s = makeStyles(C);
  return (
    <Pressable style={s.eventRow}>
      <SportIcon sport={event.sport} size={20} />
      <View style={s.eventInfo}>
        <Text style={s.eventMatch}>{event.match}</Text>
        <Text style={s.eventVenue}>{event.venue}  ·  {event.category}</Text>
      </View>
      <View style={s.eventTime}>
        {event.status === 'live' ? (
          <View style={s.liveBadge}>
            <View style={s.liveBadgeDot} />
            <Text style={s.liveBadgeText}>LIVE</Text>
          </View>
        ) : (
          <Text style={s.eventTimeText}>{event.time}</Text>
        )}
      </View>
    </Pressable>
  );
}

function makeStyles(C: C) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    glow: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: C.brand + '08', top: -120, right: -100 },
    scroll: { paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    headerLeft: { gap: 4 },
    greeting: { ...Typography.subheadline, color: C.textSecondary },
    userName: { ...Typography.title1, fontWeight: '800', color: C.text },
    userMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
    userMetaText: { ...Typography.caption, color: C.textSecondary, fontWeight: '500' },
    iconBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, alignItems: 'center', justifyContent: 'center' },
    dot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: C.brand, borderWidth: 1.5, borderColor: C.bg },
    hero: { height: 132, borderRadius: Radius.xl, overflow: 'hidden', marginBottom: 14, ...Shadows.md },
    heroPattern: { position: 'absolute', right: 0, top: 0 },
    heroCircle: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
    heroContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    heroLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
    heroTitle: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
    heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
    heroDay: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center' },
    heroDayNum: { fontSize: 22, fontWeight: '900', color: '#fff' },
    heroDayLabel: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: 1 },
    heroBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(0,0,0,0.25)' },
    heroBarFill: { height: 3, backgroundColor: '#fff' },
    walletRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 16, gap: 14 },
    walletIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.gold + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.gold + '30' },
    walletText: { flex: 1 },
    walletLabel: { ...Typography.caption, color: C.textTertiary, fontWeight: '600' },
    walletValue: { fontSize: 20, fontWeight: '800', color: C.text, marginTop: 2 },
    walletCcy: { fontSize: 12, fontWeight: '500', color: C.textSecondary },
    walletCta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    walletCtaText: { ...Typography.footnote, color: C.brand, fontWeight: '700' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 },
    sectionTitle: { ...Typography.title3, color: C.text },
    sectionAction: { ...Typography.footnote, color: C.brand, fontWeight: '600' },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.liveDot },
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    quickItem: { width: QUICK_W, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 14, alignItems: 'center', gap: 10 },
    quickIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.surface3, borderWidth: 1, borderColor: C.border2, alignItems: 'center', justifyContent: 'center' },
    quickLabel: { ...Typography.footnote, fontWeight: '600', color: C.textSecondary, textAlign: 'center' },
    hScroll: { gap: 12, paddingBottom: 4 },
    liveCard: { width: 230, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 16, gap: 12 },
    liveCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.liveDot + '20', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
    liveBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.liveDot },
    liveBadgeText: { fontSize: 10, fontWeight: '800', color: C.liveDot, letterSpacing: 0.6 },
    liveSport: { ...Typography.caption2, color: C.textSecondary, fontWeight: '600' },
    liveTeams: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    liveTeam: { alignItems: 'center', gap: 6, flex: 1 },
    liveTeamName: { ...Typography.caption, color: C.textSecondary, fontWeight: '600', textAlign: 'center' },
    liveScore: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 },
    liveScoreNum: { fontSize: 26, fontWeight: '900', color: C.text },
    liveScoreSep: { fontSize: 18, color: C.textTertiary },
    livePeriod: { ...Typography.caption, color: C.textTertiary, textAlign: 'center' },
    ticket: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 16, gap: 14 },
    ticketIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.brand + '15', borderWidth: 1, borderColor: C.brand + '30', alignItems: 'center', justifyContent: 'center' },
    ticketBody: { flex: 1, gap: 4 },
    ticketTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    ticketCat: { ...Typography.caption2, fontWeight: '800', letterSpacing: 1, color: C.brand },
    ticketStatus: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.success + '20', borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2 },
    ticketStatusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.success },
    ticketStatusText: { fontSize: 10, fontWeight: '700', color: C.success },
    ticketEvent: { ...Typography.callout, fontWeight: '700', color: C.text },
    ticketVenue: { ...Typography.footnote, color: C.textSecondary },
    ticketMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    ticketMetaText: { ...Typography.caption, color: C.textTertiary },
    eventRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 14, gap: 12, marginBottom: 8 },
    eventInfo: { flex: 1, gap: 2 },
    eventMatch: { ...Typography.callout, fontWeight: '600', color: C.text },
    eventVenue: { ...Typography.caption, color: C.textTertiary },
    eventTime: { alignItems: 'flex-end' },
    eventTimeText: { ...Typography.callout, fontWeight: '700', color: C.text },
  });
}
