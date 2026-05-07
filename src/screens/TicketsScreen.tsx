import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import GlassCard from '../components/GlassCard';
import { Colors, Typography, Radius, Shadows } from '../theme';
import { TICKETS } from '../data/mock';

const { width } = Dimensions.get('window');

export default function TicketsScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<(typeof TICKETS)[0] | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#050A18', '#051A2E', '#050A18']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.blobTop} />

      {/* Header */}
      <View style={[styles.headerWrap, { paddingTop: insets.top + 8 }]}>
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,10,24,0.5)' }]} />
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Mes Billets</Text>
            <Text style={styles.headerSub}>{TICKETS.length} pass actifs</Text>
          </View>
          <Pressable style={styles.addBtn}>
            <Ionicons name="add" size={22} color={Colors.text} />
          </Pressable>
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
        {/* Accreditation card */}
        <GlassCard style={styles.accredCard} variant="strong">
          <LinearGradient
            colors={['rgba(255,107,53,0.2)', 'rgba(201,168,76,0.1)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.accredContent}>
            <View style={styles.accredLeft}>
              <Text style={styles.accredLabel}>🪪 ACCRÉDITATION</Text>
              <Text style={styles.accredName}>Mamadou Diallo</Text>
              <Text style={styles.accredRole}>Visiteur · 🇸🇳 Sénégal</Text>
              <Text style={styles.accredNum}>JOJ-2024-VIS-08421</Text>
            </View>
            <View style={styles.qrBox}>
              <QRPlaceholder size={80} color={Colors.orange} />
            </View>
          </View>
        </GlassCard>

        {/* Ticket list */}
        <Text style={styles.sectionLabel}>BILLETS & PASS</Text>
        {TICKETS.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onPress={() => setSelected(ticket)}
          />
        ))}

        {/* Add ticket */}
        <GlassCard style={styles.addTicketCard} onPress={() => {}}>
          <View style={styles.addTicketContent}>
            <View style={styles.addIconRing}>
              <Ionicons name="add" size={28} color={Colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.addTicketTitle}>Ajouter un billet</Text>
              <Text style={styles.addTicketSub}>Scanner ou saisir un code</Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>

      {/* Ticket modal */}
      <Modal
        visible={!!selected}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <TicketModal ticket={selected} onClose={() => setSelected(null)} />
        )}
      </Modal>
    </View>
  );
}

function TicketCard({
  ticket,
  onPress,
}: {
  ticket: (typeof TICKETS)[0];
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.ticketCard}>
      <LinearGradient
        colors={ticket.gradient}
        style={styles.ticketLeft}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.ticketTypeLabel}>{ticket.type}</Text>
        <Text style={styles.ticketTime}>{ticket.time}</Text>
        <Text style={styles.ticketDate}>{ticket.date}</Text>
      </LinearGradient>

      <View style={styles.ticketRight}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.glass2 }]} />

        {/* Perforations */}
        <View style={styles.perforations}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={styles.perfDot} />
          ))}
        </View>

        <View style={styles.ticketRightContent}>
          <View style={styles.ticketRightTop}>
            <Text style={styles.ticketEventName} numberOfLines={2}>
              {ticket.event}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </View>
          <Text style={styles.ticketVenue} numberOfLines={1}>{ticket.venue}</Text>
          <Text style={styles.ticketSeat}>{ticket.seat}</Text>

          <View style={styles.ticketStatusRow}>
            <View
              style={[
                styles.statusChip,
                ticket.status === 'active' && styles.statusActive,
                ticket.status === 'upcoming' && styles.statusUpcoming,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  ticket.status === 'active' && styles.statusTextActive,
                ]}
              >
                {ticket.status === 'active' ? '✓ Actif' : '⏳ À venir'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function TicketModal({
  ticket,
  onClose,
}: {
  ticket: (typeof TICKETS)[0];
  onClose: () => void;
}) {
  return (
    <LinearGradient colors={['#050A18', '#0D0B2E']} style={styles.modal}>
      <View style={styles.modalHandle} />

      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Billet</Text>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <LinearGradient
        colors={ticket.gradient}
        style={styles.modalTicket}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.modalTicketType}>{ticket.type.toUpperCase()}</Text>
        <Text style={styles.modalTicketEvent}>{ticket.event}</Text>
        <Text style={styles.modalTicketVenue}>{ticket.venue}</Text>

        <View style={styles.modalMeta}>
          <MetaItem icon="calendar-outline" label="Date" value={ticket.date} />
          <MetaItem icon="time-outline" label="Heure" value={ticket.time} />
          <MetaItem icon="location-outline" label="Place" value={ticket.seat} />
        </View>

        <View style={styles.modalDivider}>
          {[...Array(16)].map((_, i) => (
            <View key={i} style={styles.modalPerfDot} />
          ))}
        </View>

        <View style={styles.qrCenter}>
          <QRPlaceholder size={160} color="#fff" />
          <Text style={styles.qrNote}>
            Présentez ce QR code à l'entrée
          </Text>
          <Text style={styles.qrId}>{ticket.id} · NFC disponible</Text>
        </View>
      </LinearGradient>

      <View style={styles.modalActions}>
        <Pressable style={styles.modalActionBtn}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.glass2, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border1 }]} />
          <Ionicons name="share-outline" size={20} color={Colors.text} />
          <Text style={styles.modalActionText}>Partager</Text>
        </Pressable>
        <Pressable style={styles.modalActionBtn}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.glass2, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border1 }]} />
          <Ionicons name="download-outline" size={20} color={Colors.text} />
          <Text style={styles.modalActionText}>Sauvegarder</Text>
        </Pressable>
        <Pressable style={styles.modalActionBtn}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.glass2, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border1 }]} />
          <Ionicons name="wifi-outline" size={20} color={Colors.text} />
          <Text style={styles.modalActionText}>NFC</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function MetaItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color="rgba(255,255,255,0.6)" />
      <View>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue}>{value}</Text>
      </View>
    </View>
  );
}

function QRPlaceholder({ size, color }: { size: number; color: string }) {
  const cellSize = Math.floor(size / 9);
  const pattern = [
    [1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,1,0,1,0],
    [1,1,0,1,0,0,1,1,1],
  ];
  return (
    <View style={{ width: size, height: size, gap: 1 }}>
      {pattern.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 1 }}>
          {row.map((cell, j) => (
            <View
              key={j}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? color : 'transparent',
                borderRadius: 1,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  blobTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.teal + '08',
    top: -50,
    right: -60,
  },
  headerWrap: {
    overflow: 'hidden',
    borderBottomWidth: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: { ...Typography.title2, fontWeight: '800' },
  headerSub: { ...Typography.footnote, color: Colors.textSecondary },
  headerBorder: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1 },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glass2,
    borderWidth: 1,
    borderColor: Colors.border1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 20, gap: 12 },
  accredCard: { padding: 20, overflow: 'hidden' },
  accredContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accredLeft: { gap: 4 },
  accredLabel: { ...Typography.label, color: Colors.orange },
  accredName: { ...Typography.title3, fontWeight: '700', marginTop: 4 },
  accredRole: { ...Typography.footnote, color: Colors.textSecondary },
  accredNum: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4, fontFamily: 'monospace' },
  qrBox: { padding: 8, backgroundColor: Colors.glass1, borderRadius: 10 },
  sectionLabel: { ...Typography.label, color: Colors.textTertiary, marginTop: 8 },
  ticketCard: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border1,
    ...Shadows.md,
  },
  ticketLeft: {
    width: 80,
    paddingVertical: 20,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTypeLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.8)', fontWeight: '700', textAlign: 'center' },
  ticketTime: { fontSize: 20, fontWeight: '800', color: '#fff' },
  ticketDate: { ...Typography.caption, color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: 10 },
  ticketRight: {
    flex: 1,
    overflow: 'hidden',
    padding: 14,
  },
  perforations: {
    position: 'absolute',
    left: -5,
    top: 0,
    bottom: 0,
    justifyContent: 'space-evenly',
  },
  perfDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.bg,
  },
  ticketRightContent: { paddingLeft: 4, gap: 4 },
  ticketRightTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  ticketEventName: { ...Typography.callout, fontWeight: '700', flex: 1, lineHeight: 20 },
  ticketVenue: { ...Typography.caption, color: Colors.textSecondary },
  ticketSeat: { ...Typography.caption, color: Colors.textTertiary },
  ticketStatusRow: { marginTop: 8 },
  statusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.glass1,
    borderWidth: 1,
    borderColor: Colors.border1,
  },
  statusActive: { backgroundColor: Colors.success + '20', borderColor: Colors.success + '40' },
  statusUpcoming: { backgroundColor: Colors.orange + '20', borderColor: Colors.orange + '40' },
  statusText: { ...Typography.caption, color: Colors.textTertiary, fontWeight: '600' },
  statusTextActive: { color: Colors.success },
  addTicketCard: { padding: 20 },
  addTicketContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  addIconRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.border2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTicketTitle: { ...Typography.callout, fontWeight: '600' },
  addTicketSub: { ...Typography.footnote, color: Colors.textSecondary },
  // Modal
  modal: { flex: 1, padding: 24 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border2, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { ...Typography.title2, fontWeight: '800' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glass2, alignItems: 'center', justifyContent: 'center' },
  modalTicket: {
    borderRadius: Radius.xl,
    padding: 24,
    gap: 12,
    ...Shadows.lg,
  },
  modalTicketType: { ...Typography.label, color: 'rgba(255,255,255,0.7)' },
  modalTicketEvent: { ...Typography.title2, fontWeight: '800', color: '#fff' },
  modalTicketVenue: { ...Typography.callout, color: 'rgba(255,255,255,0.7)' },
  modalMeta: { flexDirection: 'row', gap: 16, marginTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '600', textTransform: 'uppercase' },
  metaValue: { ...Typography.footnote, color: '#fff', fontWeight: '600' },
  modalDivider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -24,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalPerfDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)' },
  qrCenter: { alignItems: 'center', gap: 12, paddingTop: 8 },
  qrNote: { ...Typography.footnote, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  qrId: { ...Typography.caption, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalActionBtn: {
    flex: 1,
    height: 52,
    borderRadius: Radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalActionText: { ...Typography.caption, fontWeight: '600' },
});
