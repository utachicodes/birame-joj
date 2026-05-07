import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import GlassCard from '../components/GlassCard';
import { Colors, Spacing, Typography, Radius, Shadows } from '../theme';
import { USER, LIVE_SCORES, EVENTS, TICKETS } from '../data/mock';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#050A18', '#0D0B2E', '#1A0A0E', '#050A18']}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.3, 0.7, 1]}
      />

      {/* Decorative elements */}
      <View style={styles.blobTop} />
      <View style={styles.blobMid} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.userName}>{USER.name}</Text>
            <View style={styles.countryRow}>
              <Text style={styles.flag}>{USER.flag}</Text>
              <Text style={styles.country}>{USER.country} · {USER.role}</Text>
            </View>
          </View>
          <Pressable style={styles.notifBtn}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.glass2, borderRadius: 18, borderWidth: 1, borderColor: Colors.border1 }]} />
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            <View style={styles.notifDot} />
          </Pressable>
        </View>

        {/* Event countdown banner */}
        <GlassCard style={styles.countdownCard}>
          <LinearGradient
            colors={['rgba(255,107,53,0.3)', 'rgba(201,168,76,0.15)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.countdownContent}>
            <View>
              <Text style={styles.countdownLabel}>🏆 JEUX EN COURS</Text>
              <Text style={styles.countdownTitle}>Dakar 2026</Text>
              <Text style={styles.countdownSub}>27 Jul – 06 Août · 11 disciplines</Text>
            </View>
            <View style={styles.countdownDays}>
              <Text style={styles.countdownNum}>J+2</Text>
              <Text style={styles.countdownDayLabel}>JOUR</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '18%' }]} />
          </View>
        </GlassCard>

        {/* Quick actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accès rapide</Text>
        </View>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.id}
              style={styles.quickItem}
              onPress={() => router.push(action.route as any)}
            >
              <LinearGradient
                colors={action.gradient}
                style={styles.quickGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={[StyleSheet.absoluteFill, styles.quickOverlay]} />
              <Text style={styles.quickIcon}>{action.icon}</Text>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Live scores */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔴 En direct</Text>
          <Pressable onPress={() => router.push('/events')}>
            <Text style={styles.seeAll}>Tout voir</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {LIVE_SCORES.map((score) => (
            <LiveScoreCard key={score.id} score={score} />
          ))}
        </ScrollView>

        {/* Next ticket */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Prochain événement</Text>
          <Pressable onPress={() => router.push('/tickets')}>
            <Text style={styles.seeAll}>Mes billets</Text>
          </Pressable>
        </View>
        <NextTicketCard ticket={TICKETS[0]} />

        {/* Upcoming events */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Programme du jour</Text>
          <Pressable onPress={() => router.push('/events')}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </Pressable>
        </View>
        {EVENTS.slice(0, 3).map((event) => (
          <EventRow key={event.id} event={event} />
        ))}

        {/* Wallet widget */}
        <WalletWidget balance={USER.walletBalance} />
      </ScrollView>
    </View>
  );
}

function LiveScoreCard({ score }: { score: (typeof LIVE_SCORES)[0] }) {
  return (
    <GlassCard style={styles.liveCard} variant="strong">
      <LinearGradient
        colors={[score.color + '20', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <Text style={styles.liveSport}>{score.sport}</Text>
      <View style={styles.scoreRow}>
        <View style={styles.teamCol}>
          <Text style={styles.teamFlag}>{score.homeFlag}</Text>
          <Text style={styles.teamName}>{score.homeTeam}</Text>
        </View>
        <View style={styles.scoreMid}>
          <Text style={styles.scoreNum}>{score.homeScore}</Text>
          <Text style={styles.scoreDash}>–</Text>
          <Text style={styles.scoreNum}>{score.awayScore}</Text>
        </View>
        <View style={styles.teamCol}>
          <Text style={styles.teamFlag}>{score.awayFlag}</Text>
          <Text style={styles.teamName}>{score.awayTeam}</Text>
        </View>
      </View>
      <Text style={styles.scorePeriod}>{score.period}</Text>
    </GlassCard>
  );
}

function NextTicketCard({ ticket }: { ticket: (typeof TICKETS)[0] }) {
  return (
    <GlassCard style={styles.nextTicket}>
      <LinearGradient
        colors={ticket.gradient}
        style={styles.ticketAccentBar}
      />
      <View style={styles.ticketContent}>
        <View style={styles.ticketLeft}>
          <Text style={styles.ticketType}>{ticket.type}</Text>
          <Text style={styles.ticketEvent}>{ticket.event}</Text>
          <Text style={styles.ticketVenue}>{ticket.venue}</Text>
          <View style={styles.ticketMeta}>
            <Ionicons name="time-outline" size={13} color={Colors.textTertiary} />
            <Text style={styles.ticketMetaText}>{ticket.date} · {ticket.time}</Text>
          </View>
        </View>
        <View style={styles.ticketQrPlaceholder}>
          <View style={styles.qrDots}>
            {[...Array(16)].map((_, i) => (
              <View
                key={i}
                style={[styles.qrDot, { opacity: Math.random() > 0.4 ? 1 : 0.2 }]}
              />
            ))}
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

function EventRow({ event }: { event: (typeof EVENTS)[0] }) {
  return (
    <GlassCard style={styles.eventRow} onPress={() => {}}>
      <View style={[styles.eventAccent, { backgroundColor: event.color }]} />
      <Text style={styles.eventIcon}>{event.icon}</Text>
      <View style={styles.eventInfo}>
        <Text style={styles.eventMatch}>{event.match}</Text>
        <Text style={styles.eventVenue}>{event.venue}</Text>
      </View>
      <View style={styles.eventTime}>
        {event.status === 'live' && (
          <View style={styles.liveChip}>
            <View style={styles.liveDot} />
            <Text style={styles.liveChipText}>LIVE</Text>
          </View>
        )}
        <Text style={styles.eventTimeText}>{event.time}</Text>
      </View>
    </GlassCard>
  );
}

function WalletWidget({ balance }: { balance: number }) {
  const router = useRouter();
  return (
    <GlassCard style={styles.walletWidget} onPress={() => router.push('/wallet' as any)}>
      <LinearGradient
        colors={['rgba(201,168,76,0.25)', 'rgba(201,168,76,0.08)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.walletContent}>
        <View>
          <Text style={styles.walletLabel}>💳 Mon Wallet JOJ</Text>
          <Text style={styles.walletBalance}>
            {balance.toLocaleString('fr-FR')} <Text style={styles.walletCurrency}>XOF</Text>
          </Text>
        </View>
        <Pressable style={styles.topUpBtn} onPress={() => router.push('/wallet' as any)}>
          <LinearGradient colors={[Colors.gold, Colors.goldLight]} style={StyleSheet.absoluteFill} />
          <Text style={styles.topUpText}>Recharger</Text>
        </Pressable>
      </View>
    </GlassCard>
  );
}

const QUICK_ACTIONS = [
  { id: '1', icon: '🎫', label: 'Mes Billets', route: '/tickets', gradient: ['rgba(255,107,53,0.4)', 'rgba(255,107,53,0.15)'] as const },
  { id: '2', icon: '🗺️', label: 'Carte', route: '/map', gradient: ['rgba(78,205,196,0.4)', 'rgba(78,205,196,0.15)'] as const },
  { id: '3', icon: '🚌', label: 'Transport', route: '/transport', gradient: ['rgba(123,94,167,0.4)', 'rgba(123,94,167,0.15)'] as const },
  { id: '4', icon: '🍔', label: 'Commander', route: '/food', gradient: ['rgba(201,168,76,0.4)', 'rgba(201,168,76,0.15)'] as const },
  { id: '5', icon: '🏅', label: 'Médailles', route: '/events', gradient: ['rgba(61,142,245,0.4)', 'rgba(61,142,245,0.15)'] as const },
  { id: '6', icon: '📣', label: 'Alertes', route: '/', gradient: ['rgba(224,111,168,0.4)', 'rgba(224,111,168,0.15)'] as const },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  blobTop: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: Colors.orange + '08',
    top: -100,
    right: -80,
  },
  blobMid: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.purple + '10',
    top: 400,
    left: -60,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
  },
  greeting: {
    ...Typography.callout,
    color: Colors.textSecondary,
  },
  userName: {
    ...Typography.title1,
    fontWeight: '800',
    marginTop: 2,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  flag: {
    fontSize: 16,
  },
  country: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
    borderWidth: 1.5,
    borderColor: Colors.bg,
  },
  countdownCard: {
    padding: 20,
    marginTop: 8,
    overflow: 'hidden',
    gap: 12,
  },
  countdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countdownLabel: {
    ...Typography.label,
    color: Colors.orange,
    marginBottom: 4,
  },
  countdownTitle: {
    ...Typography.title2,
    fontWeight: '800',
  },
  countdownSub: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  countdownDays: {
    alignItems: 'center',
    backgroundColor: Colors.glass2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border1,
    padding: 12,
    minWidth: 64,
  },
  countdownNum: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.orange,
  },
  countdownDayLabel: {
    ...Typography.label,
    color: Colors.textTertiary,
    fontSize: 9,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.glass1,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.orange,
    borderRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    ...Typography.title3,
    fontWeight: '700',
  },
  seeAll: {
    ...Typography.footnote,
    color: Colors.orange,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  quickItem: {
    width: (width - 40 - 24) / 3,
    aspectRatio: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 8,
    ...Shadows.sm,
  },
  quickGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  quickOverlay: {
    backgroundColor: Colors.glass1,
    borderRadius: Radius.lg,
  },
  quickIcon: {
    fontSize: 28,
  },
  quickLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  horizontalList: {
    paddingHorizontal: 0,
    gap: 12,
    paddingBottom: 4,
  },
  liveCard: {
    width: 200,
    padding: 16,
    gap: 8,
    overflow: 'hidden',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: Colors.error + '25',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.error,
    letterSpacing: 0.5,
  },
  liveSport: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  teamCol: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  teamFlag: {
    fontSize: 22,
  },
  teamName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreMid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  scoreNum: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  scoreDash: {
    ...Typography.headline,
    color: Colors.textTertiary,
  },
  scorePeriod: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 4,
  },
  nextTicket: {
    overflow: 'hidden',
    marginTop: 4,
  },
  ticketAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  ticketContent: {
    flexDirection: 'row',
    padding: 16,
    paddingLeft: 20,
    gap: 12,
    alignItems: 'center',
  },
  ticketLeft: {
    flex: 1,
    gap: 4,
  },
  ticketType: {
    ...Typography.label,
    color: Colors.orange,
  },
  ticketEvent: {
    ...Typography.headline,
    fontWeight: '700',
  },
  ticketVenue: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ticketMetaText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  ticketQrPlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: Colors.glass2,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 6,
  },
  qrDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  qrDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: Colors.text,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  eventAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  eventIcon: {
    fontSize: 24,
    marginLeft: 8,
  },
  eventInfo: {
    flex: 1,
    gap: 2,
  },
  eventMatch: {
    ...Typography.callout,
    fontWeight: '600',
  },
  eventVenue: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  eventTime: {
    alignItems: 'flex-end',
    gap: 4,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.error + '20',
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  liveChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.error,
    letterSpacing: 0.5,
  },
  eventTimeText: {
    ...Typography.footnote,
    fontWeight: '700',
    color: Colors.text,
  },
  walletWidget: {
    marginTop: 16,
    overflow: 'hidden',
  },
  walletContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  walletLabel: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  walletCurrency: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  topUpBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  topUpText: {
    ...Typography.callout,
    fontWeight: '700',
    color: Colors.bg,
  },
});
