import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CountryBadge from '../components/CountryBadge'; // flag badge for user country
import { Colors, Typography, Radius } from '../theme';
import { TICKETS } from '../data/mock'; // static ticket fixtures
import { useApp } from '../context/AppContext';

export default function TicketsScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const user = state.user;
  const [selected, setSelected] = useState<(typeof TICKETS)[0] | null>(null); // ticket open in modal

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bg]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Mes Billets</Text>
            <Text style={styles.headerSub}>{TICKETS.length} pass actifs</Text> {/* ticket count */}
          </View>
          <Pressable style={styles.iconBtn}> {/* add ticket button */}
            <Ionicons name="add" size={22} color={Colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Accreditation card */}
        <View style={styles.accred}>
          <LinearGradient colors={[Colors.brand, Colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={styles.accredPattern}> {/* decorative rings overlay */}
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.accredCircle, { width: 160 + i * 60, height: 160 + i * 60, borderRadius: (160 + i * 60) / 2, right: -50 - i * 20, top: -30 - i * 15 }]} /> // concentric circles, each bigger
            ))}
          </View>
          <View style={styles.accredHead}> {/* "official accreditation" label row */}
            <Ionicons name="shield-checkmark" size={18} color="#fff" />
            <Text style={styles.accredHeadText}>ACCRÉDITATION OFFICIELLE</Text>
          </View>
          <Text style={styles.accredName}>{user?.name ?? ''}</Text> {/* user full name */}
          <View style={styles.accredMeta}> {/* country flag + role info */}
            <CountryBadge code={user?.countryCode ?? ''} size="md" />
            <View>
              <Text style={styles.accredRole}>{user?.role ?? ''}</Text>
              <Text style={styles.accredCountry}>{user?.country ?? ''}</Text>
            </View>
          </View>
          <View style={styles.accredFooter}>
            <View>
              <Text style={styles.accredFooterLabel}>N° ACCRÉDITATION</Text>
              <Text style={styles.accredNum}>{user?.accreditation ?? ''}</Text> {/* unique accreditation ID */}
            </View>
            <View style={styles.accredQr}> {/* QR placeholder box */}
              <Ionicons name="qr-code" size={36} color="#fff" />
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>BILLETS &amp; PASS</Text>

        {TICKETS.map((t) => (
          <TicketCard key={t.id} ticket={t} onPress={() => setSelected(t)} /> // open modal on press
        ))}

        <Pressable style={styles.addCard}> {/* manual ticket entry row */}
          <View style={styles.addIconRing}>
            <Ionicons name="add" size={26} color={Colors.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addTitle}>Ajouter un billet</Text>
            <Text style={styles.addSub}>Scanner un QR ou saisir un code</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
        </Pressable>
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && <TicketModal ticket={selected} onClose={() => setSelected(null)} />} {/* only render when ticket is selected */}
      </Modal>
    </View>
  );
}

function TicketCard({ ticket, onPress }: { ticket: (typeof TICKETS)[0]; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardLeft}> {/* icon + category label column */}
        <View style={styles.cardIconWrap}>
          <Ionicons name={ticket.icon} size={22} color={Colors.brand} />
        </View>
        <Text style={styles.cardCat}>{ticket.type.toUpperCase()}</Text> {/* e.g. SPORT, CULTURE */}
      </View>
      <View style={styles.cardDivider} /> {/* vertical separator */}
      <View style={styles.cardBody}>
        <Text style={styles.cardEvent} numberOfLines={2}>{ticket.event}</Text>
        <Text style={styles.cardVenue} numberOfLines={1}>{ticket.venue}</Text>
        <View style={styles.cardMeta}> {/* date + time row */}
          <View style={styles.cardMetaItem}>
            <Ionicons name="calendar-outline" size={11} color={Colors.textTertiary} />
            <Text style={styles.cardMetaText}>{ticket.date}</Text>
          </View>
          <View style={styles.cardMetaItem}>
            <Ionicons name="time-outline" size={11} color={Colors.textTertiary} />
            <Text style={styles.cardMetaText}>{ticket.time}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, ticket.status === 'active' ? styles.statusActive : styles.statusUpcoming]}>
          <View style={[styles.statusDot, { backgroundColor: ticket.status === 'active' ? Colors.success : Colors.warning }]} /> {/* green or amber dot */}
          <Text style={[styles.statusText, { color: ticket.status === 'active' ? Colors.success : Colors.warning }]}>
            {ticket.status === 'active' ? 'Actif' : 'À venir'}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
    </Pressable>
  );
}

function TicketModal({ ticket, onClose }: { ticket: (typeof TICKETS)[0]; onClose: () => void }) {
  return (
    <View style={styles.modal}>
      <LinearGradient colors={[Colors.bg, Colors.bgDeep]} style={StyleSheet.absoluteFill} />
      <View style={styles.modalHandle} /> {/* drag handle */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Billet</Text>
        <Pressable onPress={onClose} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.modalScroll}>
        <View style={styles.modalTicket}> {/* full ticket view with gradient bg */}
          <LinearGradient colors={[Colors.brand, Colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={styles.modalTicketHead}>
            <View style={styles.modalTicketIconWrap}>
              <Ionicons name={ticket.icon} size={26} color="#fff" />
            </View>
            <Text style={styles.modalTicketCat}>{ticket.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.modalTicketEvent}>{ticket.event}</Text>
          <Text style={styles.modalTicketVenue}>{ticket.venue}</Text>

          <View style={styles.modalMeta}> {/* 3-column date / time / seat strip */}
            <MetaItem icon="calendar-outline" label="Date" value={ticket.date} />
            <View style={styles.modalMetaDivider} />
            <MetaItem icon="time-outline" label="Heure" value={ticket.time} />
            <View style={styles.modalMetaDivider} />
            <MetaItem icon="location-outline" label="Place" value={ticket.seat} />
          </View>

          <View style={styles.modalDivider}> {/* dotted tear line between info and QR */}
            {[...Array(20)].map((_, i) => (
              <View key={i} style={styles.modalPerf} /> // each dot in the perforation
            ))}
          </View>

          <View style={styles.modalQrWrap}>
            <View style={styles.modalQrInner}> {/* white box for QR code */}
              <Ionicons name="qr-code" size={140} color={Colors.bg} />
            </View>
            <Text style={styles.modalQrNote}>Présentez ce QR à l'entrée</Text>
            <Text style={styles.modalQrId}>{ticket.id}</Text> {/* ticket ID under QR */}
          </View>
        </View>

        <View style={styles.modalActions}> {/* share / save / NFC row */}
          <ActionBtn icon="share-outline" label="Partager" />
          <ActionBtn icon="download-outline" label="Sauvegarder" />
          <ActionBtn icon="wifi-outline" label="NFC" />
        </View>
      </ScrollView>
    </View>
  );
}

function MetaItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.modalMetaItem}> {/* icon + label + value stacked */}
      <Ionicons name={icon} size={12} color="rgba(255,255,255,0.7)" />
      <Text style={styles.modalMetaLabel}>{label}</Text>
      <Text style={styles.modalMetaValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function ActionBtn({ icon, label }: { icon: any; label: string }) {
  return (
    <Pressable style={styles.actionBtn}>
      <Ionicons name={icon} size={20} color={Colors.text} />
      <Text style={styles.actionBtnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { ...Typography.title2, fontWeight: '800' },
  headerSub: { ...Typography.footnote, color: Colors.textSecondary, marginTop: 2 },
  iconBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, gap: 12 },

  // Accreditation
  accred: { borderRadius: Radius.xl, padding: 22, overflow: 'hidden', gap: 14, marginBottom: 8 },
  accredPattern: { position: 'absolute', right: 0, top: 0 },
  accredCircle: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }, // faint ring
  accredHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  accredHeadText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, color: 'rgba(255,255,255,0.85)' },
  accredName: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.4 },
  accredMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  accredRole: { fontSize: 14, fontWeight: '700', color: '#fff' },
  accredCountry: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  accredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 },
  accredFooterLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: 'rgba(255,255,255,0.7)' },
  accredNum: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'monospace', marginTop: 2 }, // monospace for ID
  accredQr: { width: 56, height: 56, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },

  sectionLabel: { ...Typography.label, marginTop: 8, marginBottom: 4 },

  // Ticket card
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 14, gap: 12 },
  cardLeft: { alignItems: 'center', gap: 8, width: 60 }, // fixed width left column
  cardIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.brand + '15', borderWidth: 1, borderColor: Colors.brand + '30', alignItems: 'center', justifyContent: 'center' },
  cardCat: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: Colors.brand },
  cardDivider: { width: StyleSheet.hairlineWidth, height: 60, backgroundColor: Colors.border1 },
  cardBody: { flex: 1, gap: 4 },
  cardEvent: { ...Typography.callout, fontWeight: '700', lineHeight: 19 },
  cardVenue: { ...Typography.caption, color: Colors.textSecondary },
  cardMeta: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cardMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 11, color: Colors.textTertiary, fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2, marginTop: 4 },
  statusActive: { backgroundColor: Colors.success + '18' }, // green tint
  statusUpcoming: { backgroundColor: Colors.warning + '18' }, // amber tint
  statusDot: { width: 5, height: 5, borderRadius: 3 }, // small indicator dot
  statusText: { fontSize: 10, fontWeight: '700' },

  // Add card
  addCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.surface1, borderWidth: 1, borderColor: Colors.border1, borderStyle: 'dashed', borderRadius: Radius.lg, padding: 16, marginTop: 4 }, // dashed = placeholder feel
  addIconRing: { width: 44, height: 44, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  addTitle: { ...Typography.callout, fontWeight: '600' },
  addSub: { ...Typography.caption, color: Colors.textTertiary },

  // Modal
  modal: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border2, alignSelf: 'center', marginBottom: 14 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { ...Typography.title2, fontWeight: '800' },
  modalScroll: { paddingBottom: 40, gap: 14 },
  modalTicket: { borderRadius: Radius.xl, padding: 24, gap: 14, overflow: 'hidden' }, // ticket body
  modalTicketHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalTicketIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  modalTicketCat: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, color: 'rgba(255,255,255,0.85)' },
  modalTicketEvent: { fontSize: 22, fontWeight: '800', color: '#fff', lineHeight: 26 },
  modalTicketVenue: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  modalMeta: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: Radius.md, padding: 12, marginTop: 4 }, // dark pill for meta
  modalMetaItem: { flex: 1, alignItems: 'center', gap: 4 },
  modalMetaDivider: { width: StyleSheet.hairlineWidth, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  modalMetaLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: 'rgba(255,255,255,0.7)' },
  modalMetaValue: { fontSize: 12, fontWeight: '700', color: '#fff' },
  modalDivider: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -24, paddingHorizontal: 16, paddingVertical: 8 }, // bleed to edges for tear-line effect
  modalPerf: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.18)' }, // single perforation dot
  modalQrWrap: { alignItems: 'center', gap: 8 },
  modalQrInner: { width: 160, height: 160, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }, // white QR container
  modalQrNote: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  modalQrId: { fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.55)' }, // faint ID below QR
  modalActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, height: 56, borderRadius: Radius.lg, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  actionBtnText: { ...Typography.caption, fontWeight: '600' },
});
