// ─── IMPORTS ─────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,       
  Text,       
  StyleSheet, 
  ScrollView, 
  Pressable,  
  Dimensions, 
  Modal,      
  Image,      
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';           
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Returns the screen's safe-area padding (avoids notch / home indicator)
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';       
import CountryBadge from '../components/CountryBadge'; // Small flag/badge component that shows a country's icon
import SportIcon from '../components/SportIcon';       
import { getColors, Radius, Shadows, Typography } from '../theme';
import { LIVE_SCORES, EVENTS, TICKETS, NOTIFICATIONS } from '../data/mock';
import { useApp } from '../context/AppContext';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const { width } = Dimensions.get('window');

// Calculate the width of each Quick Action button so 3 fit in a row with 12 px gaps and 20 px side padding
const QUICK_W = (width - 40 - 24) / 3;

// Static list of quick-access shortcuts shown on the home screen grid
const QUICK_ACTIONS: Array<{
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;                        
  route: string;                        
}> = [
  { id: '1', icon: 'ticket-outline',     label: 'Mes Billets', route: '/tickets'   },
  { id: '2', icon: 'map-outline',        label: 'Carte',       route: '/map'       },
  { id: '3', icon: 'bus-outline',        label: 'Transport',   route: '/transport' },
  { id: '4', icon: 'restaurant-outline', label: 'Commander',   route: '/food'      },
  { id: '5', icon: 'medal-outline',      label: 'Médailles',   route: '/events'    },
  { id: '6', icon: 'wallet-outline',     label: 'Wallet',      route: '/wallet'    },
];

// Pre-compute how many notifications are unread so we can show a badge count
const UNREAD_COUNT = NOTIFICATIONS.filter((n) => !n.read).length;

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router  = useRouter();       
  const { state } = useApp();
  const C = getColors(state.theme);
  const s = makeStyles(C);
  const user = state.user;

  const [showNotifs, setShowNotifs] = useState(false);

  return (
   
    <View style={s.container}>

      {/* System status bar — uses light icons on dark theme and dark icons on light theme */}
      <StatusBar style={state.theme === 'dark' ? 'light' : 'dark'} />

      {/* Full-screen background gradient from bg → bgElevated → bg for a subtle depth effect */}
      <LinearGradient colors={[C.bg, C.bgElevated, C.bg]} style={StyleSheet.absoluteFill} />

      {/* Decorative glow blob placed in the top-right corner for visual flair */}
      <View style={s.glow} />

      {/* ── Scrollable page body ── */}
      <ScrollView
        style={{ flex: 1 }}
       
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER: logo, greeting, user info, notifications bell ── */}
        <View style={s.header}>

          {/* Left column: logo row + user name + country */}
          <View style={s.headerLeft}>

            {/* Logo Dakar 2026 dans l'en-tête, sans texte à côté */}
            <View style={s.logoRow}>
              <View style={s.logoBg}>
                <Image
                  source={require('../../assets/dakarlogo.png')}
                  style={s.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Greeting subtitle "Bonjour," in the secondary text color */}
            <Text style={[s.greeting, { color: C.textSecondary }]}>Bonjour,</Text>

            <Text style={[s.userName, { color: C.text }]}>{user?.name ?? ''}</Text> {/* user's full name */}

            <View style={s.userMeta}>
              <CountryBadge code={user?.countryCode ?? ''} size="sm" /> {/* flag chip */}
              <Text style={[s.userMetaText, { color: C.textSecondary }]}>
                {user?.country}  ·  {user?.role} {/* e.g. "Sénégal · Athlète" */}
              </Text>
            </View>
          </View>

          {/* Notification bell button — opens the notification sheet when pressed */}
          <Pressable style={[s.iconBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]} onPress={() => setShowNotifs(true)}>
            <Ionicons name="notifications-outline" size={20} color={C.text} />
            {/* Red dot badge — only shown when there are unread notifications */}
            {UNREAD_COUNT > 0 && <View style={[s.dot, { backgroundColor: C.brand, borderColor: C.bg }]} />}
          </Pressable>
        </View>

        {/* ── HERO BANNER: game summary card with gradient + progress bar ── */}
        <Pressable style={[s.hero, Shadows.md]}>

          {/* Gradient background: brand color → dark brand, diagonal direction */}
          <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

          {/* Decorative translucent circles in the top-right corner */}
          <View style={s.heroPattern}>
            {[0, 1, 2].map((i) => (
             
              <View key={i} style={[s.heroCircle, { width: 180 + i * 80, height: 180 + i * 80, borderRadius: (180 + i * 80) / 2, right: -60 - i * 30, top: -40 - i * 20 }]} />
            ))}
          </View>

          {/* Main content row: event info on the left, day counter on the right */}
          <View style={s.heroContent}>
            <View>
              <Text style={s.heroLabel}>JEUX EN COURS</Text>       {/* Small uppercase label */}
              <Text style={s.heroTitle}>Dakar 2026</Text>           {/* Event name — large headline */}
              <Text style={s.heroSub}>27 Jul — 06 Août  ·  11 disciplines</Text> {/* Dates + number of sports */}
            </View>

            {/* Day counter badge — shows how many days into the games we are */}
            <View style={s.heroDay}>
              <Text style={s.heroDayNum}>J+2</Text>      {/* Current day number */}
              <Text style={s.heroDayLabel}>JOUR</Text>   {/* "DAY" label below */}
            </View>
          </View>

          {/* Progress bar at the bottom of the hero — shows how far through the games we are */}
          <View style={s.heroBar}>
            <View style={[s.heroBarFill, { width: '18%' }]} /> {/* Filled portion = 18% of games elapsed */}
          </View>
        </Pressable>

        {/* ── WALLET ROW: shows the user's JOJ Wallet balance with a recharge CTA ── */}
        <Pressable style={[s.walletRow, { backgroundColor: C.surface2, borderColor: C.border1 }]} onPress={() => router.push('/wallet' as any)}>

          {/* Gold wallet icon in a tinted rounded box */}
          <View style={[s.walletIcon, { backgroundColor: C.gold + '20', borderColor: C.gold + '30' }]}>
            <Ionicons name="wallet-outline" size={22} color={C.gold} />
          </View>

          {/* Label + balance amount (formatted with French locale thousands separator) */}
          <View style={s.walletText}>
            <Text style={[s.walletLabel, { color: C.textTertiary }]}>Solde JOJ Wallet</Text>
            <Text style={[s.walletValue, { color: C.text }]}>
              {state.walletBalance.toLocaleString('fr-FR')}
              <Text style={[s.walletCcy, { color: C.textSecondary }]}>  XOF</Text>
            </Text>
          </View>

          {/* "Recharger →" call-to-action link on the right */}
          <View style={s.walletCta}>
            <Text style={[s.walletCtaText, { color: C.brand }]}>Recharger</Text>
            <Ionicons name="arrow-forward" size={14} color={C.brand} />
          </View>
        </Pressable>

        {/* ── QUICK ACTIONS GRID ── */}
        <SectionHeader title="Accès rapide" C={C} /> {/* Section title row (no live dot, no right link) */}
        <View style={s.quickGrid}>
          {/* Render one button per quick action — 3 per row thanks to QUICK_W */}
          {QUICK_ACTIONS.map((a) => (
            <Pressable key={a.id} style={[s.quickItem, { backgroundColor: C.surface2, borderColor: C.border1 }]} onPress={() => router.push(a.route as any)}>
              {/* Icon container with a slightly elevated background */}
              <View style={[s.quickIconBox, { backgroundColor: C.surface3, borderColor: C.border2 }]}>
                <Ionicons name={a.icon} size={22} color={C.text} />
              </View>
              {/* Text label below the icon */}
              <Text style={[s.quickLabel, { color: C.textSecondary }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── LIVE SCORES: horizontal carousel of ongoing matches ── */}
        {/* dot=true adds a pulsing red dot next to the title to signal live content */}
        <SectionHeader title="En direct" dot C={C} right="Tout voir" onRight={() => router.push('/events')} />
        {/* Horizontal scroll — each card shows one live match */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
          {LIVE_SCORES.map((sc) => <LiveCard key={sc.id} score={sc} C={C} onPress={() => router.push('/events')} />)}
        </ScrollView>

        {/* ── NEXT TICKET: shows the user's next upcoming event ticket ── */}
        <SectionHeader title="Prochain événement" right="Mes billets" C={C} onRight={() => router.push('/tickets')} />
        <NextTicket ticket={TICKETS[0]} C={C} onPress={() => router.push('/tickets')} /> {/* Always shows the first ticket */}

        {/* ── TODAY'S SCHEDULE: first 3 events of the day ── */}
        <SectionHeader title="Programme du jour" right="Voir tout" C={C} onRight={() => router.push('/events')} />
        {/* slice(0, 3) limits to 3 rows so the home screen doesn't get too long */}
        {EVENTS.slice(0, 3).map((e) => <EventRow key={e.id} event={e} C={C} onPress={() => router.push('/events')} />)}

      </ScrollView>

      {/* ── NOTIFICATIONS MODAL: slides up from the bottom when the bell is tapped ── */}
      <Modal visible={showNotifs} animationType="slide" transparent onRequestClose={() => setShowNotifs(false)}>

        {/* Semi-transparent dark backdrop — tapping it closes the sheet */}
        <Pressable style={s.modalBackdrop} onPress={() => setShowNotifs(false)} />

        {/* The actual bottom sheet panel */}
        <View style={[s.notifSheet, { backgroundColor: C.bg, borderColor: C.border1, paddingBottom: insets.bottom + 24 }]}>

          {/* Drag handle pill at the top of the sheet (visual cue that it can be dismissed) */}
          <View style={[s.sheetHandle, { backgroundColor: C.border2 }]} />

          {/* Sheet header: title + optional unread count badge */}
          <View style={s.notifHeader}>
            <Text style={[s.notifTitle, { color: C.text }]}>Notifications</Text>
            {/* Only render the badge if there are unread notifications */}
            {UNREAD_COUNT > 0 && (
              <View style={[s.notifBadge, { backgroundColor: C.brand + '20', borderColor: C.brand + '30' }]}>
                <Text style={[s.notifBadgeText, { color: C.brand }]}>{UNREAD_COUNT} non lues</Text>
              </View>
            )}
          </View>

          {/* Scrollable list of notifications — capped at 420px so the close button stays visible */}
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
            {NOTIFICATIONS.map((n, i) => (
              <View key={n.id}>
                {/* Individual notification row — highlighted if unread */}
                <Pressable style={[s.notifRow, !n.read && { backgroundColor: C.surface2 }]}>

                  {/* Icon box with a tinted background matching the notification's color */}
                  <View style={[s.notifIconBox, { backgroundColor: n.color + '15', borderColor: n.color + '30' }]}>
                    <Ionicons name={n.icon} size={18} color={n.color} />
                  </View>

                  {/* Text content: title + unread dot, body text, timestamp */}
                  <View style={s.notifBody}>
                    <View style={s.notifTitleRow}>
                      <Text style={[s.notifItemTitle, { color: C.text }]}>{n.title}</Text>
                      {/* Small blue dot shown only on unread notifications */}
                      {!n.read && <View style={[s.unreadDot, { backgroundColor: C.brand }]} />}
                    </View>
                    <Text style={[s.notifItemBody, { color: C.textSecondary }]}>{n.body}</Text>
                    <Text style={[s.notifTime, { color: C.textTertiary }]}>{n.time}</Text>
                  </View>
                </Pressable>

                {/* Horizontal divider between rows — hidden after the last item */}
                {i < NOTIFICATIONS.length - 1 && <View style={[s.divider, { backgroundColor: C.border1 }]} />}
              </View>
            ))}
          </ScrollView>

          {/* "Fermer" close button at the bottom of the sheet */}
          <Pressable style={[s.closeBtn, { backgroundColor: C.surface3, borderColor: C.border2 }]} onPress={() => setShowNotifs(false)}>
            <Text style={[s.closeBtnText, { color: C.text }]}>Fermer</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

// ─── TYPE ALIAS ───────────────────────────────────────────────────────────────

// Shorthand type that represents the full color object returned by getColors()
type C = ReturnType<typeof getColors>;

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

/**
 * SectionHeader — a reusable title row used above every content section.
 * Shows an optional live dot on the left and an optional tappable link on the right.
 */
function SectionHeader({ title, right, onRight, dot, C }: { title: string; right?: string; onRight?: () => void; dot?: boolean; C: C }) {
  const s = makeStyles(C);
  return (
    <View style={s.sectionHeader}>
      {/* Left side: optional live dot + section title */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {dot && <View style={[s.liveDot, { backgroundColor: C.liveDot }]} />} {/* Pulsing dot for live sections */}
        <Text style={[s.sectionTitle, { color: C.text }]}>{title}</Text>
      </View>
      {/* Right side: optional action link (e.g. "Voir tout") */}
      {right && (
        <Pressable onPress={onRight}>
          <Text style={[s.sectionAction, { color: C.brand }]}>{right}</Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * LiveCard — horizontal-scroll card that displays a single live match score.
 * Shows sport name, team flags, the current score, and the match period.
 */
function LiveCard({ score, C, onPress }: { score: (typeof LIVE_SCORES)[0]; C: C; onPress: () => void }) {
  const s = makeStyles(C);
  return (
    <Pressable style={[s.liveCard, { backgroundColor: C.surface2, borderColor: C.border1 }]} onPress={onPress}>

      {/* Top row: LIVE badge on the left, sport name on the right */}
      <View style={s.liveCardHeader}>
        {/* "LIVE" pill badge with a colored dot */}
        <View style={[s.liveBadge, { backgroundColor: C.liveDot + '20' }]}>
          <View style={[s.liveBadgeDot, { backgroundColor: C.liveDot }]} />
          <Text style={[s.liveBadgeText, { color: C.liveDot }]}>LIVE</Text>
        </View>
        <Text style={[s.liveSport, { color: C.textSecondary }]}>{score.sport}</Text> {/* e.g. "Basketball" */}
      </View>

      {/* Middle row: home team — score — away team */}
      <View style={s.liveTeams}>
        {/* Home team flag + name */}
        <View style={s.liveTeam}>
          <CountryBadge code={score.homeCode} size="md" />
          <Text style={[s.liveTeamName, { color: C.textSecondary }]}>{score.homeTeam}</Text>
        </View>

        {/* Score display: homeScore : awayScore */}
        <View style={s.liveScore}>
          <Text style={[s.liveScoreNum, { color: C.text }]}>{score.homeScore}</Text>
          <Text style={[s.liveScoreSep, { color: C.textTertiary }]}>:</Text>
          <Text style={[s.liveScoreNum, { color: C.text }]}>{score.awayScore}</Text>
        </View>

        {/* Away team flag + name */}
        <View style={s.liveTeam}>
          <CountryBadge code={score.awayCode} size="md" />
          <Text style={[s.liveTeamName, { color: C.textSecondary }]}>{score.awayTeam}</Text>
        </View>
      </View>

      {/* Current match period (e.g. "Q3 · 5:42") */}
      <Text style={[s.livePeriod, { color: C.textTertiary }]}>{score.period}</Text>
    </Pressable>
  );
}

/**
 * NextTicket — displays the user's next upcoming ticket as a compact row card.
 * Shows the sport icon, event name, venue, date/time, and an "active" status badge.
 */
function NextTicket({ ticket, C, onPress }: { ticket: (typeof TICKETS)[0]; C: C; onPress: () => void }) {
  const s = makeStyles(C);
  return (
    <Pressable style={[s.ticket, { backgroundColor: C.surface2, borderColor: C.border1 }]} onPress={onPress}>

      {/* Icon box on the left — uses the ticket's specific icon */}
      <View style={[s.ticketIconWrap, { backgroundColor: C.brand + '15', borderColor: C.brand + '30' }]}>
        <Ionicons name={ticket.icon} size={22} color={C.brand} />
      </View>

      {/* Main text content */}
      <View style={s.ticketBody}>
        {/* Top row: ticket category label + green "Actif" status pill */}
        <View style={s.ticketTopRow}>
          <Text style={[s.ticketCat, { color: C.brand }]}>{ticket.type}</Text> {/* e.g. "FINALE" */}
          <View style={[s.ticketStatus, { backgroundColor: C.success + '20' }]}>
            <View style={[s.ticketStatusDot, { backgroundColor: C.success }]} /> {/* Green dot */}
            <Text style={[s.ticketStatusText, { color: C.success }]}>Actif</Text>
          </View>
        </View>

        <Text style={[s.ticketEvent, { color: C.text }]}>{ticket.event}</Text>     {/* Event title */}
        <Text style={[s.ticketVenue, { color: C.textSecondary }]}>{ticket.venue}</Text> {/* Venue name */}

        {/* Date and time row with a clock icon */}
        <View style={s.ticketMeta}>
          <Ionicons name="time-outline" size={13} color={C.textTertiary} />
          <Text style={[s.ticketMetaText, { color: C.textTertiary }]}>{ticket.date}  ·  {ticket.time}</Text>
        </View>
      </View>

      {/* Chevron arrow on the far right — signals the row is tappable */}
      <Ionicons name="chevron-forward" size={18} color={C.textTertiary} />
    </Pressable>
  );
}

/**
 * EventRow — a single row in the "Programme du jour" list.
 * Shows the sport icon, match name, venue/category, and either a LIVE badge or a start time.
 */
function EventRow({ event, C, onPress }: { event: (typeof EVENTS)[0]; C: C; onPress: () => void }) {
  const s = makeStyles(C);
  return (
    <Pressable style={[s.eventRow, { backgroundColor: C.surface2, borderColor: C.border1 }]} onPress={onPress}>

      {/* Sport-specific icon on the left */}
      <SportIcon sport={event.sport} size={20} />

      {/* Match name + venue/category in the middle */}
      <View style={s.eventInfo}>
        <Text style={[s.eventMatch, { color: C.text }]}>{event.match}</Text>      {/* e.g. "Sénégal vs Mali" */}
        <Text style={[s.eventVenue, { color: C.textTertiary }]}>{event.venue}  ·  {event.category}</Text>
      </View>

      {/* Right side: show "LIVE" badge if ongoing, otherwise show scheduled start time */}
      <View style={s.eventTime}>
        {event.status === 'live' ? (
         
          <View style={[s.liveBadge, { backgroundColor: C.liveDot + '20' }]}>
            <View style={[s.liveBadgeDot, { backgroundColor: C.liveDot }]} />
            <Text style={[s.liveBadgeText, { color: C.liveDot }]}>LIVE</Text>
          </View>
        ) : (
          // Scheduled time (e.g. "14:00")
          <Text style={[s.eventTimeText, { color: C.text }]}>{event.time}</Text>
        )}
      </View>
    </Pressable>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

/**
 * makeStyles — generates a StyleSheet using the current color palette.
 * Called once inside each component so colors update when the theme changes.
 */
function makeStyles(C: C) {
  return StyleSheet.create({

   
    container: { flex: 1, backgroundColor: C.bg },

   
    glow: {
      position: 'absolute',      
      width: 400, height: 400,   
      borderRadius: 200,         
      backgroundColor: C.brand + '08',
      top: -120, right: -100,    
    },

   
    scroll: { paddingHorizontal: 20 },

   
    header: {
      flexDirection: 'row',           
      alignItems: 'flex-start',        // Align to top so the bell doesn't stretch
      justifyContent: 'space-between',
      marginBottom: 20,               
    },
    headerLeft: { gap: 4 },

    // ── Logo row (image + "JOJ 2026" label) ──
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    logoBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 4 },
    logo: { width: '100%', height: '100%' },

    // ── "JOJ 2026" text next to the logo ──
    logoLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },

    // ── "Bonjour," subtitle ──
    greeting: { ...Typography.subheadline },

    // ── User's full name ──
    userName: { ...Typography.title1, fontWeight: '800' },

    // ── Country flag + "Country · Role" row ──
    userMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
    userMetaText: { ...Typography.caption, fontWeight: '500' },

   
    iconBtn: {
      width: 42, height: 42,        
      borderRadius: 14,             
      borderWidth: 1,               
      alignItems: 'center', justifyContent: 'center',
    },

   
    dot: {
      position: 'absolute',       
      top: 10, right: 10,         
      width: 8, height: 8,
      borderRadius: 4,            
      borderWidth: 1.5,           
    },

   
    hero: {
      height: 132,
      borderRadius: Radius.xl,
      overflow: 'hidden',      
      marginBottom: 14,
    },
    heroPattern: { position: 'absolute', right: 0, top: 0 },
    heroCircle: {
      position: 'absolute',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.10)',
    },
    heroContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
    },

    // ── "JEUX EN COURS" small label ──
    heroLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },

    // ── "Dakar 2026" large event name ──
    heroTitle: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },

   
    heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

    // ── Day counter badge ("J+2 / JOUR") ──
    heroDay: {
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderRadius: Radius.md,
      paddingHorizontal: 14, paddingVertical: 8,
      alignItems: 'center',
    },
    heroDayNum: { fontSize: 22, fontWeight: '900', color: '#fff' },  
    heroDayLabel: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: 1 }, // "JOUR" label

   
    heroBar: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 3,
      backgroundColor: 'rgba(0,0,0,0.25)',
    },
    heroBarFill: { height: 3, backgroundColor: '#fff' },

   
    walletRow: {
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1, borderRadius: Radius.lg,
      padding: 16, gap: 14,
    },
    walletIcon: {
      width: 44, height: 44, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1,
    },
    walletText: { flex: 1 },

    // ── "Solde JOJ Wallet" label ──
    walletLabel: { ...Typography.caption, fontWeight: '600' },

    // ── Balance amount (e.g. "12 500") ──
    walletValue: { fontSize: 20, fontWeight: '800', marginTop: 2 },

    // ── "XOF" currency suffix ──
    walletCcy: { fontSize: 12, fontWeight: '500' },

    // ── "Recharger →" CTA on the right ──
    walletCta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    walletCtaText: { ...Typography.footnote, fontWeight: '700' },

   
    sectionHeader: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 24, marginBottom: 12,
    },
    sectionTitle: { ...Typography.title3 },                        // e.g. "Accès rapide"
    sectionAction: { ...Typography.footnote, fontWeight: '600' },  // e.g. "Voir tout"

    // ── Small red dot used next to "En direct" title ──
    liveDot: { width: 8, height: 8, borderRadius: 4 },

   
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

   
    quickItem: {
      width: QUICK_W,       
      borderWidth: 1, borderRadius: Radius.lg,
      padding: 14,
      alignItems: 'center',
      gap: 10,             
    },

   
    quickIconBox: {
      width: 44, height: 44, borderRadius: 12,
      borderWidth: 1,
      alignItems: 'center', justifyContent: 'center',
    },
    quickLabel: { ...Typography.footnote, fontWeight: '600', textAlign: 'center' },

   
    hScroll: { gap: 12, paddingBottom: 4 }, // 12 px gap between cards; 4 px bottom so shadow isn't clipped

   
    liveCard: { width: 230, borderWidth: 1, borderRadius: Radius.lg, padding: 16, gap: 12 },

   
    liveCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

    // ── "LIVE" pill badge ──
    liveBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      borderRadius: Radius.full,         
      paddingHorizontal: 8, paddingVertical: 3,
    },
    liveBadgeDot: { width: 6, height: 6, borderRadius: 3 },

    // ── "LIVE" text inside the badge ──
    liveBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },

    // ── Sport name (e.g. "Basketball") ──
    liveSport: { ...Typography.caption2, fontWeight: '600' },

   
    liveTeams: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

   
    liveTeam: { alignItems: 'center', gap: 6, flex: 1 },
    liveTeamName: { ...Typography.caption, fontWeight: '600', textAlign: 'center' },

    // ── Score in the middle (e.g. "72 : 68") ──
    liveScore: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 },
    liveScoreNum: { fontSize: 26, fontWeight: '900' },
    liveScoreSep: { fontSize: 18 },                    // ":" separator between scores

    // ── Match period (e.g. "Q3 · 5:42") ──
    livePeriod: { ...Typography.caption, textAlign: 'center' },

   
    ticket: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: Radius.lg, padding: 16, gap: 14 },

   
    ticketIconWrap: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

   
    ticketBody: { flex: 1, gap: 4 },

   
    ticketTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },

    // ── Ticket category label (e.g. "FINALE") ──
    ticketCat: { ...Typography.caption2, fontWeight: '800', letterSpacing: 1 },

    // ── Green "Actif" status pill ──
    ticketStatus: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2 },
    ticketStatusDot: { width: 5, height: 5, borderRadius: 3 },
    ticketStatusText: { fontSize: 10, fontWeight: '700' },

    ticketEvent: { ...Typography.callout, fontWeight: '700' },
    ticketVenue: { ...Typography.footnote },                  

   
    ticketMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    ticketMetaText: { ...Typography.caption },

    // ── Event row in today's schedule ──
    eventRow: {
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1, borderRadius: Radius.lg,
      padding: 14, gap: 12,
      marginBottom: 8,
    },
    eventInfo: { flex: 1, gap: 2 },

    // ── Match title (e.g. "Sénégal vs Mali") ──
    eventMatch: { ...Typography.callout, fontWeight: '600' },

   
    eventVenue: { ...Typography.caption },

   
    eventTime: { alignItems: 'flex-end' },

   
    eventTimeText: { ...Typography.callout, fontWeight: '700' },

   

   
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },

   
    notifSheet: {
      borderTopLeftRadius: 28, borderTopRightRadius: 28,
      borderWidth: 1, borderBottomWidth: 0,             
      paddingHorizontal: 20, paddingTop: 12,
    },

   
    sheetHandle: { width: 38, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },

    // "Notifications" title + unread count badge row
    notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    notifTitle: { fontSize: 18, fontWeight: '800', flex: 1 },

    // Unread count badge (e.g. "3 non lues")
    notifBadge: { borderRadius: Radius.full, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
    notifBadgeText: { fontSize: 12, fontWeight: '700' },

   
    notifRow: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 12,
      paddingVertical: 14, paddingHorizontal: 4,
      borderRadius: Radius.md,
    },

   
    notifIconBox: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

   
    notifBody: { flex: 1, gap: 3 },

   
    notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    notifItemTitle: { fontSize: 13, fontWeight: '700', flex: 1 },

   
    unreadDot: { width: 7, height: 7, borderRadius: 4 },

    notifItemBody: { fontSize: 13, lineHeight: 18 },
    notifTime: { fontSize: 11, fontWeight: '500', marginTop: 2 }, // Timestamp (e.g. "Il y a 5 min")

   
    divider: { height: StyleSheet.hairlineWidth, marginLeft: 52 },

    // "Fermer" close button at the bottom of the sheet
    closeBtn: { marginTop: 16, height: 48, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    closeBtnText: { fontSize: 15, fontWeight: '700' },
  });
}
